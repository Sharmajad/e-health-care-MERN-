
import mongoose from "mongoose";
import dotenv from "dotenv";
import Hospital from "./src/models/Hospital.js";

dotenv.config();

const checkCoords = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/e_healthcare");
    const hospitals = await Hospital.find({ lat: { $exists: true } });
    console.log(`Found ${hospitals.length} hospitals with coordinates.`);
    hospitals.slice(0, 5).forEach(h => {
        console.log(`${h.name}: ${h.lat}, ${h.lng}`);
    });
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
};
checkCoords();
