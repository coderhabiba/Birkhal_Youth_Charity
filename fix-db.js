const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

const envFile = fs.readFileSync('.env', 'utf8');
let mongoUri = '';
for (const line of envFile.split('\n')) {
  if (line.startsWith('MONGODB_URI=')) {
    mongoUri = line.substring('MONGODB_URI='.length).trim();
    if (mongoUri.startsWith('"') || mongoUri.startsWith("'")) {
      mongoUri = mongoUri.slice(1, -1);
    }
  }
}

function processBase64Image(dataUrl, prefix = 'img') {
  if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image')) {
    return dataUrl;
  }
  try {
    const commaIndex = dataUrl.indexOf(',');
    if (commaIndex === -1) return dataUrl;

    const meta = dataUrl.substring(0, commaIndex);
    const base64Data = dataUrl.substring(commaIndex + 1);

    const typeMatch = meta.match(/data:image\/([a-zA-Z0-9+.-]+);base64/i);
    let ext = typeMatch ? typeMatch[1].toLowerCase() : 'jpg';
    if (ext === 'jpeg') ext = 'jpg';
    if (ext === 'svg+xml') ext = 'svg';

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filename = `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}.${ext}`;
    const filePath = path.join(uploadsDir, filename);
    const buffer = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(filePath, buffer);
    return `/uploads/${filename}`;
  } catch (err) {
    console.error('Failed to save base64 image:', err);
    return dataUrl;
  }
}

async function run() {
  const client = new MongoClient(mongoUri);

  try {
    await client.connect();
    console.log("Connected to MongoDB");
    const db = client.db();

    const reviewColl = db.collection('reviews');
    const reviews = await reviewColl.find({}).toArray();
    let rCount = 0;
    for (const doc of reviews) {
      if (doc.image && doc.image.startsWith('data:image')) {
        const newUrl = processBase64Image(doc.image, 'review');
        await reviewColl.updateOne({ _id: doc._id }, { $set: { image: newUrl } });
        rCount++;
      }
    }
    console.log(`Updated ${rCount} reviews`);

    const mediaColl = db.collection('media');
    const medias = await mediaColl.find({}).toArray();
    let mCount = 0;
    for (const doc of medias) {
      if (doc.url && doc.url.startsWith('data:image')) {
        const newUrl = processBase64Image(doc.url, 'media');
        await mediaColl.updateOne({ _id: doc._id }, { $set: { url: newUrl } });
        mCount++;
      }
    }
    console.log(`Updated ${mCount} medias`);

    const memberColl = db.collection('members');
    const members = await memberColl.find({}).toArray();
    let memCount = 0;
    for (const doc of members) {
      if (doc.photoUrl && doc.photoUrl.startsWith('data:image')) {
        const newUrl = processBase64Image(doc.photoUrl, 'member');
        await memberColl.updateOne({ _id: doc._id }, { $set: { photoUrl: newUrl } });
        memCount++;
      }
    }
    console.log(`Updated ${memCount} members`);

  } finally {
    await client.close();
  }
}

run().catch(console.dir);
