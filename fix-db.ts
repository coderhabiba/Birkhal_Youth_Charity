import { connect } from 'mongoose';
import Review from './src/models/Review';
import Member from './src/models/Member';
import Media from './src/models/Media';
import Event from './src/models/Event';
import { processBase64Image } from './src/lib/uploadHelper';

require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

async function fixDb() {
  await connect(process.env.MONGODB_URI as string);
  console.log("Connected to DB");

  const reviewCursor = Review.find().cursor();
  let updatedReviews = 0;
  for await (const r of reviewCursor) {
    if (r.image && r.image.startsWith('data:image')) {
      r.image = processBase64Image(r.image, 'review');
      await r.save();
      updatedReviews++;
    }
  }
  console.log(`Updated ${updatedReviews} reviews`);

  const memberCursor = Member.find().cursor();
  let updatedMembers = 0;
  for await (const m of memberCursor) {
    if (m.photoUrl && m.photoUrl.startsWith('data:image')) {
      m.photoUrl = processBase64Image(m.photoUrl, 'member');
      await m.save();
      updatedMembers++;
    }
  }
  console.log(`Updated ${updatedMembers} members`);

  const mediaCursor = Media.find().cursor();
  let updatedMedias = 0;
  for await (const m of mediaCursor) {
    if (m.url && m.url.startsWith('data:image')) {
      m.url = processBase64Image(m.url, 'media');
      await m.save();
      updatedMedias++;
    }
  }
  console.log(`Updated ${updatedMedias} medias`);

  const eventCursor = Event.find().cursor();
  let updatedEvents = 0;
  for await (const e of eventCursor) {
    if (e.image && e.image.startsWith('data:image')) {
      e.image = processBase64Image(e.image, 'event');
      await e.save();
      updatedEvents++;
    }
  }
  console.log(`Updated ${updatedEvents} events`);

  console.log("Done");
  process.exit(0);
}

fixDb().catch(console.error);
