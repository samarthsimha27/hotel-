import mongoose from 'mongoose';

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("---------------------------------------------------------");
    console.error("DB CRITICAL ERROR: MONGO_URI in environment variables is blank!");
    console.error("Please configure MONGO_URI in your backend/.env file.");
    console.error("---------------------------------------------------------");
    process.exit(1);
  }

  const options = {
    autoIndex: true, // Auto-compile unique index lists on startup
  };

  let retries = 5;
  while (retries > 0) {
    try {
      console.log("Connecting to MongoDB database cluster...");
      await mongoose.connect(mongoUri, options);
      console.log("Database connection secured successfully via Mongoose.");
      break;
    } catch (error) {
      retries -= 1;
      console.error(`Database Connection Failure: ${error.message}`);
      console.error(`Retries remaining: ${retries}`);
      if (retries === 0) {
        console.error("---------------------------------------------------------");
        console.error("CRITICAL: Failed to establish database connection after multiple retries. Exiting.");
        console.error("---------------------------------------------------------");
        process.exit(1);
      }
      // Wait for 2 seconds before retrying
      await new Promise(res => setTimeout(res, 2000));
    }
  }
};
