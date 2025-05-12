import mongoose, { ConnectOptions } from "mongoose";

const connectDb = async (): Promise<void> => {
  if (mongoose.connections[0].readyState) {
    // Already connected
    return;
  }

  const mongoUri = process.env.MONGO_URL;

  if (!mongoUri) {
    throw new Error("MONGO_URL environment variable is not defined");
  }

  try {
    await mongoose.connect(mongoUri, {
      useUnifiedTopology: true,
    } as ConnectOptions);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

export default connectDb;
