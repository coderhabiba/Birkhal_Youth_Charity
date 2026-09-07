import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Review from '@/models/Review';
import Member from '@/models/Member';
import Media from '@/models/Media';
import Event from '@/models/Event';
import { processBase64Image } from '@/lib/uploadHelper';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();

    const reviews = await Review.find();
    let updatedReviews = 0;
    for (let r of reviews) {
      if (r.image && r.image.startsWith('data:image')) {
        r.image = processBase64Image(r.image, 'review');
        await r.save();
        updatedReviews++;
      }
    }

    const members = await Member.find();
    let updatedMembers = 0;
    for (let m of members) {
      if (m.photoUrl && m.photoUrl.startsWith('data:image')) {
        m.photoUrl = processBase64Image(m.photoUrl, 'member');
        await m.save();
        updatedMembers++;
      }
    }

    const medias = await Media.find();
    let updatedMedias = 0;
    for (let m of medias) {
      if (m.url && m.url.startsWith('data:image')) {
        m.url = processBase64Image(m.url, 'media');
        await m.save();
        updatedMedias++;
      }
    }

    const events = await Event.find();
    let updatedEvents = 0;
    for (let e of events) {
      if (e.image && e.image.startsWith('data:image')) {
        e.image = processBase64Image(e.image, 'event');
        await e.save();
        updatedEvents++;
      }
    }

    return NextResponse.json({
      success: true,
      updated: { reviews: updatedReviews, members: updatedMembers, medias: updatedMedias, events: updatedEvents }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
