import connectToDatabase from "@/lib/mongodb";
import Review from "@/models/Review";
import Committee from "@/models/Committee";
import Member from "@/models/Member";
import Setting from "@/models/Setting";
import Media from "@/models/Media";
import Event from "@/models/Event";
import { HomeClient } from "./home-client";

export const revalidate = 0; // Fresh dynamic data on every request

export default async function Home() {
  await connectToDatabase();
  
  // Auto-migrate legacy URLs in database and remove unwanted items
  try {
    await Media.deleteMany({ title: { $regex: /যুবসমাজ উন্নয়ন ও দক্ষতা প্রশিক্ষণ|দক্ষতা প্রশিক্ষণ/i } });
    await Media.updateMany({ url: '/support1.jpeg' }, { url: '/up-1.jpeg' });
    await Media.updateMany({ url: '/support2.jpeg' }, { url: '/ai_relief.jpg' });
    await Media.updateMany({ url: '/support3.jpeg' }, { url: '/ai_education.jpg' });
    await Media.updateMany({ url: '/support4.jpeg' }, { url: '/ai_plantation.jpg' });

    // Ensure stats default to 0 if legacy dummy values exist
    await Setting.updateMany({ key: 'stat_volunteers', value: { $in: ['500+', '500'] } }, { value: '0' });
    await Setting.updateMany({ key: 'stat_trees', value: { $in: ['1,200+', '1K+', '1200+'] } }, { value: '0' });
    await Setting.updateMany({ key: 'stat_students', value: { $in: ['250+', '200+'] } }, { value: '0' });
  } catch (e) {}

  // Fetch approved reviews, committee members, approved general members, settings, media, and active events concurrently
  const [rawReviews, rawCommittee, rawMembers, rawSettings, rawMedia, rawEvents] = await Promise.all([
    Review.find({ status: 'approved' }).sort({ createdAt: -1 }).lean(),
    Committee.find().sort({ createdAt: 1 }).lean(),
    Member.find({ status: 'approved' }).sort({ createdAt: -1 }).lean(),
    Setting.find().lean(),
    Media.find({ isDoc: false }).sort({ createdAt: -1 }).limit(12).lean(),
    Event.find({ status: { $in: ['upcoming', 'ongoing'] } }).sort({ date: 1 }).lean(),
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

  return (
    <HomeClient 
      initialReviews={initialReviews} 
      committeeMembers={committeeMembers}
      generalMembers={generalMembers}
      settings={settingsMap}
      mediaList={galleryMedia}
      eventsList={eventsList}
    />
  );
}
