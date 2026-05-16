/**
 * ================================================================
 * DATABASE CONFIGURATION — config/db.js
 * ================================================================
 * Establishes a Mongoose connection to MongoDB Atlas (or local).
 * The MONGO_URI must be set in the .env file.
 * Exits the process immediately if the connection fails so the
 * server doesn't start in a broken state.
 * ================================================================
 */

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // Fatal — cannot run without a database connection
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
