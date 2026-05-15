import mongoose from "mongoose"
import dotenv from "dotenv"
import User from "./src/models/User.js"

dotenv.config()

const checkUsers = async () => {
  await mongoose.connect(process.env.MONGO_URI)
  const users = await User.find({})
  console.log("Total Users:", users.length)
  users.forEach(u => {
    console.log(`- ID: ${u._id}, Name: ${u.name}, Email: ${u.email}`)
  })
  process.exit()
}

checkUsers()
