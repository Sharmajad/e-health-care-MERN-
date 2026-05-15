import mongoose from "mongoose"
import dotenv from "dotenv"
import Report from "./src/models/Report.js"

dotenv.config()

const checkReports = async () => {
  await mongoose.connect(process.env.MONGO_URI)
  const reports = await Report.find({})
  console.log("Total Reports:", reports.length)
  reports.forEach(r => {
    console.log(`- ID: ${r._id}, User: ${r.userId}, FileUrl: ${r.fileUrl}, Type: ${r.type}`)
  })
  process.exit()
}

checkReports()
