const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log('Connected to DB');
  
  // Just use arbitrary collection if model is not available
  const db = mongoose.connection.db;
  
  const start = Date.now();
  const reviews = await db.collection('reviews').find({}).sort({ createdAt: -1 }).toArray();
  const end = Date.now();
  
  console.log(`Fetched ${reviews.length} reviews in ${end - start}ms`);
  
  // Check total size
  const totalSize = Buffer.byteLength(JSON.stringify(reviews), 'utf8');
  console.log(`Total payload size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
  
  mongoose.disconnect();
}).catch(console.error);
