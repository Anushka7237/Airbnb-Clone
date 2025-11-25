const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const Listing = require('../models/listing');

// Update this if your DB URL differs
const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

async function run() {
  await mongoose.connect(MONGO_URL);
  console.log('Connected to DB for migration');

  // Match likely Windows absolute paths such as 'C:\...' or 'D:\...'
  const listings = await Listing.find({ 'image.url': { $regex: '^[A-Za-z]:\\\\' } });
  console.log(`Found ${listings.length} listings with absolute paths`);

  for (const l of listings) {
    try {
      const oldUrl = l.image && l.image.url ? l.image.url : '';
      const filename = path.basename(oldUrl);
      const candidate = path.join(__dirname, '..', 'public', 'uploads', filename);
      if (fs.existsSync(candidate)) {
        l.image.url = `/uploads/${filename}`;
        await l.save();
        console.log(`Updated listing ${l._id} -> /uploads/${filename}`);
      } else {
        console.log(`File not found for listing ${l._id}: ${candidate}`);
      }
    } catch (err) {
      console.error('Error updating listing', l._id, err);
    }
  }

  await mongoose.disconnect();
  console.log('Migration complete');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
