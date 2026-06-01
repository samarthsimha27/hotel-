import mongoose from 'mongoose';

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.log("---------------------------------------------------------");
    console.log("DB WARNING: MONGO_URI environment variable is empty.");
    console.log("Backend will operate in-memory using persistent caches.");
    console.log("---------------------------------------------------------");
    return;
  }
  
  try {
    console.log("---------------------------------------------------------");
    console.log("Connecting to MongoDB database cluster...");
    
    // Actually execute the live Mongoose connection
    await mongoose.connect(mongoUri);
    
    console.log("Database connection secured successfully via Mongoose.");
    console.log("---------------------------------------------------------");
  } catch (error) {
    console.error("---------------------------------------------------------");
    console.error(`Database Connection Failure: ${error.message}`);
    console.error("Please verify that your database cluster is online and");
    console.error("your connection string is formatted correctly in .env.");
    console.error("---------------------------------------------------------");
    process.exit(1);
  }
};
