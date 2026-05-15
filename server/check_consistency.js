
import mongoose from "mongoose";
import dotenv from "dotenv";
import Doctor from "./src/models/Doctor.js";
import Hospital from "./src/models/Hospital.js";

dotenv.config();

const checkData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/e_healthcare");
    console.log("Connected to MongoDB");

    const hospitals = await Hospital.find({}).limit(5);
    console.log("Hospitals:");
    hospitals.forEach(h => console.log(`- ${h.name}`));

    const doctors = await Doctor.find({}).limit(5);
    console.log("Doctors:");
    doctors.forEach(d => console.log(`- ${d.name} at ${d.hospital}`));

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error);
  }
};

checkData();
