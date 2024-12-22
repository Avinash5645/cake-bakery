import mongoose from "mongoose";

let isConnected = false; // Tracks the connection status

const connectDB = async (): Promise<void> => {
  mongoose.set("strictQuery", true); // Enable strict query mode

  if (isConnected) {
    console.log("MongoDB is already connected");
    return;
  }

  try {
    if (!process.env.MONGODB_URL) {
      throw new Error("MONGODB_URL is not defined in the environment variables.");
    }

    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: "Cake-Bakery-admin",
    });

    isConnected = true;
    console.log("MongoDB is connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error; // Rethrow the error to handle it further upstream
  }
};

export default connectDB;
