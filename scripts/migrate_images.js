const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb+srv://birkhalyouthorg_db_user:EeqnMH8Q39VleBRC@cluster0.8hr2yka.mongodb.net/charity-portal?retryWrites=true&w=majority';
const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

function saveBase64(dataUrl, filenamePrefix) {
  if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image')) {
    return null;
  }
  const match = dataUrl.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/s);
  if (!match) return null;

  let ext = match[1].toLowerCase();
  if (ext === 'jpeg') ext = 'jpg';
  if (ext === 'svg+xml') ext = 'svg';

  const buffer = Buffer.from(match[2], 'base64');
  const filename = `${filenamePrefix}.${ext}`;
  const filePath = path.join(uploadsDir, filename);
  fs.writeFileSync(filePath, buffer);
  return `/uploads/${filename}`;
}

async function run() {
  console.log('Connecting to MongoDB Atlas...');
  const client = new MongoClient(uri, {
    socketTimeoutMS: 60000,
    connectTimeoutMS: 30000,
  });
  await client.connect();
  const db = client.db('charity-portal');
  console.log('Connected! Migrating one document at a time...\n');

  // 1. SETTINGS
  console.log('--- 1. Checking Settings ---');
  const settingsList = await db.collection('settings').find({}, { projection: { _id: 1, key: 1 } }).toArray();
  for (const s of settingsList) {
    const doc = await db.collection('settings').findOne({ _id: s._id });
    if (doc && doc.value && typeof doc.value === 'string' && doc.value.startsWith('data:image')) {
      const publicUrl = saveBase64(doc.value, `setting_${doc.key}`);
      if (publicUrl) {
        await db.collection('settings').updateOne(
          { _id: doc._id },
          { $set: { value: publicUrl } }
        );
        console.log(`  ✓ Setting "${doc.key}": replaced ${(doc.value.length / 1024).toFixed(1)} KB base64 with "${publicUrl}"`);
      }
    }
  }
  console.log('Settings check done.\n');

  // 2. COMMITTEES
  console.log('--- 2. Checking Committees ---');
  const comList = await db.collection('committees').find({}, { projection: { _id: 1, name: 1 } }).toArray();
  console.log(`Found ${comList.length} committees. Checking images...`);
  let comMigrated = 0;
  for (let i = 0; i < comList.length; i++) {
    const item = comList[i];
    const doc = await db.collection('committees').findOne({ _id: item._id });
    if (doc && doc.image && typeof doc.image === 'string' && doc.image.startsWith('data:image')) {
      const publicUrl = saveBase64(doc.image, `committee_${doc._id}`);
      if (publicUrl) {
        await db.collection('committees').updateOne(
          { _id: doc._id },
          { $set: { image: publicUrl } }
        );
        console.log(`  [${i + 1}/${comList.length}] ✓ "${doc.name}": saved ${(doc.image.length / 1024).toFixed(1)} KB -> "${publicUrl}"`);
        comMigrated++;
      }
    } else {
      // already a URL or no image
      // console.log(`  [${i + 1}/${comList.length}] Already clean: ${item.name}`);
    }
  }
  console.log(`Committees done: ${comMigrated} base64 images extracted to files.\n`);

  // 3. MEMBERS
  console.log('--- 3. Checking Members ---');
  const memList = await db.collection('members').find({}, { projection: { _id: 1, nameBn: 1, nameEn: 1 } }).toArray();
  console.log(`Found ${memList.length} members. Checking images...`);
  let memMigrated = 0;
  for (let i = 0; i < memList.length; i++) {
    const item = memList[i];
    const doc = await db.collection('members').findOne({ _id: item._id });
    if (!doc) continue;

    let updated = false;
    const updateFields = {};

    if (doc.photoUrl && typeof doc.photoUrl === 'string' && doc.photoUrl.startsWith('data:image')) {
      const publicUrl = saveBase64(doc.photoUrl, `member_${doc._id}`);
      if (publicUrl) {
        updateFields.photoUrl = publicUrl;
        updated = true;
      }
    }

    if (doc.image && typeof doc.image === 'string' && doc.image.startsWith('data:image')) {
      const publicUrl = saveBase64(doc.image, `member_img_${doc._id}`);
      if (publicUrl) {
        updateFields.image = publicUrl;
        updated = true;
      }
    }

    if (updated) {
      await db.collection('members').updateOne(
        { _id: doc._id },
        { $set: updateFields }
      );
      console.log(`  [${i + 1}/${memList.length}] ✓ "${doc.nameBn || doc.nameEn || doc._id}": saved to static file`);
      memMigrated++;
    }
  }
  console.log(`Members done: ${memMigrated} base64 images extracted to files.\n`);

  // 4. MEDIA
  console.log('--- 4. Checking Media ---');
  const mediaList = await db.collection('media').find({}, { projection: { _id: 1, title: 1 } }).toArray();
  console.log(`Found ${mediaList.length} media items. Checking images...`);
  let mediaMigrated = 0;
  for (let i = 0; i < mediaList.length; i++) {
    const item = mediaList[i];
    const doc = await db.collection('media').findOne({ _id: item._id });
    if (doc && doc.url && typeof doc.url === 'string' && doc.url.startsWith('data:image')) {
      const publicUrl = saveBase64(doc.url, `media_${doc._id}`);
      if (publicUrl) {
        await db.collection('media').updateOne(
          { _id: doc._id },
          { $set: { url: publicUrl } }
        );
        console.log(`  [${i + 1}/${mediaList.length}] ✓ "${doc.title || doc._id}": saved ${(doc.url.length / 1024).toFixed(1)} KB -> "${publicUrl}"`);
        mediaMigrated++;
      }
    }
  }
  console.log(`Media done: ${mediaMigrated} base64 images extracted to files.\n`);

  console.log('=== All base64 images have been successfully migrated to /public/uploads/! ===');
  await client.close();
}

run().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
