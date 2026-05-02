
import express from "express"
import dotenv from "dotenv"
dotenv.config()
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"
import compression from "compression"
import connectDB from "./config/db.js"
import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import appointmentRoutes from "./routes/appointmentRoutes.js"
import reportRoutes from "./routes/reportRoutes.js"
import doctorRoutes from "./routes/doctorRoutes.js"
import hospitalRoutes from "./routes/hospitalRoutes.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const startServer = async () => {
  await connectDB()
  const app = express()

  app.use(cors({ origin: "http://localhost:5173", credentials: true }))
  app.use(express.json())
  
  app.use(compression())
  app.use("/uploads", express.static(path.join(__dirname, "../../uploads")))

  app.use("/api/auth",         authRoutes)
  app.use("/api/users",        userRoutes)
  app.use("/api/appointments", appointmentRoutes)
  app.use("/api/report",       reportRoutes)
  app.use("/api/doctors",      doctorRoutes)
  app.use("/api/hospitals",    hospitalRoutes)

  app.get("/api/health", (req, res) => {
    res.json({ status: "API working OK" })
  })

  const PORT = process.env.PORT || 5000
  const server = app.listen(PORT, () => {
    console.log("Server running at http://localhost:" + PORT)
  })
  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") console.log("Port " + PORT + " busy. Kill it first.")
  })
}

startServer()
