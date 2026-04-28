import express from "express"
import dotenv from "dotenv"
dotenv.config()
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"
import connectDB from "./config/db.js"
import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import appointmentRoutes from "./routes/appointmentRoutes.js"
import reportRoutes from "./routes/reportRoutes.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const startServer = async () => {
  await connectDB()
  const app = express()

  app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
  }))

  app.use(express.json())

  app.use("/uploads", express.static(path.join(__dirname, "../../uploads")))

  app.use("/api/auth",         authRoutes)
  app.use("/api/users",        userRoutes)
  app.use("/api/appointments", appointmentRoutes)
  app.use("/api/report",       reportRoutes)

  app.get("/api/health", (req, res) => {
    res.json({ status: "API working OK" })
  })

  const PORT = process.env.PORT || 5000
  app.listen(PORT, () => {
    console.log("Server running at http://localhost:" + PORT)
  })
}

startServer()
