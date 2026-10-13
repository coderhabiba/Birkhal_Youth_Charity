import connectToDatabase from "@/lib/mongodb";
import Review from "@/models/Review";
import Committee from "@/models/Committee";
import Member from "@/models/Member";
import Setting from "@/models/Setting";
import Media from "@/models/Media";
import Event from "@/models/Event";
import { HomeClient } from "./home-client";
import { cachedQuery } from "@/lib/cache";

export const dynamic = 'force-dynamic';

const QUERY_TIMEOUT = 8000; // 8 seconds max per query

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error(`Query timeout after ${ms}ms`)), ms))
  ]);
}

async function getHomeData() {
  await connectToDatabase();

  // Run queries in parallel with individual timeouts
  const [rawReviews, rawCommittee, rawMembers, rawSettings, rawMedia, rawEvents] = await Promise.all([
    withTimeout(Review.find({ status: 'approved' }).sort({ createdAt: -1 }).limit(50).lean(), QUERY_TIMEOUT).catch(() => []),
    withTimeout(Committee.find().sort({ createdAt: 1 }).limit(50).lean(), QUERY_TIMEOUT).catch(() => []),
    withTimeout(Member.find({ status: 'approved' }).sort({ createdAt: -1 }).limit(50).lean(), QUERY_TIMEOUT).catch(() => []),
    withTimeout(Setting.find().lean(), QUERY_TIMEOUT).catch(() => []),
    withTimeout(Media.find({ isDoc: false }).sort({ createdAt: -1 }).limit(50).lean(), QUERY_TIMEOUT).catch(() => []),
    withTimeout(Event.find({ status: { $in: ['upcoming', 'ongoing'] } }).sort({ date: 1 }).limit(50).lean(), QUERY_TIMEOUT).catch(() => [])
  ]);

  const initialReviews = rawReviews.map((r: any) => ({
    ...r,
    _id: r._id.toString(),
    createdAt: r.createdAt ? r.createdAt.toISOString() : null,
  }));

  const committeeMembers = rawCommittee.map((c: any) => ({
    ...c,
    _id: c._id.toString(),
    createdAt: c.createdAt ? c.createdAt.toISOString() : null,
  }));

  const generalMembers = rawMembers.map((m: any) => ({
    ...m,
    _id: m._id.toString(),
    createdAt: m.createdAt ? m.createdAt.toISOString() : null,
  }));

  const galleryMedia = rawMedia.map((m: any) => ({
    ...m,
    _id: m._id.toString(),
    createdAt: m.createdAt ? m.createdAt.toISOString() : null,
  }));

  const eventsList = rawEvents.map((e: any) => ({
    ...e,
    _id: e._id.toString(),
    date: e.date ? e.date.toISOString() : null,
    createdAt: e.createdAt ? e.createdAt.toISOString() : null,
  }));

  const settingsMap: Record<string, string> = {};
  rawSettings.forEach((s: any) => {
    settingsMap[s.key] = s.value;
  });

  return { initialReviews, committeeMembers, generalMembers, galleryMedia, eventsList, settingsMap };
}

const EMPTY_HOME_DATA = { initialReviews: [], committeeMembers: [], generalMembers: [], galleryMedia: [], eventsList: [], settingsMap: {} };

export default async function Home() {
  const data = await cachedQuery('home-page-data', getHomeData, 60_000).catch(() => EMPTY_HOME_DATA);

  return (
    <HomeClient 
      initialReviews={data.initialReviews} 
      committeeMembers={data.committeeMembers}
      generalMembers={data.generalMembers}
      settings={data.settingsMap}
      mediaList={data.galleryMedia}
      eventsList={data.eventsList}
    />
  );
}

