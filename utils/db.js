const mongoose = require('mongoose');
const env = require('dotenv')

const MONGO_URL = env.process.MONGO_URL;

const connectDb = async () => {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected!");
    
  } catch (error) {
    console.log("Error Connecting MongoDB ", error);
    process.exit(1);
  }
};

module.exports = { connectDb };
