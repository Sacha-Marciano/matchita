import mongoose from "mongoose";

const connectDb = async () => {
  if (mongoose.connections[0].readyState) {
    // Already connected
    return;
  }

  // Use your MongoDB URI from environment variables
  const mongoUri = process.env.MONGO_URL;

  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1); // Exit if MongoDB connection fails
  }
};

export default connectDb;
