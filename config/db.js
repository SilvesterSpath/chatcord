const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../config/.env') });
console.log('db', __dirname);

const dbUrl = process.env.MONGO_URI;

async function connectDB() {
  const client = await MongoClient.connect(dbUrl, {});

  try {
    await client.db('notes').command({ ping: 1 });
    console.log('Connected successfully to database');
  } catch (error) {
    console.error(error);
  }

  return client.db('notes');
}

module.exports = {
  connectDB,
};
