import express from "express"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"
import compression from "compression"

import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import appointmentRoutes from "./routes/appointmentRoutes.js"
import reportRoutes from "./routes/reportRoutes.js"
import doctorRoutes from "./routes/doctorRoutes.js"
import hospitalRoutes from "./routes/hospitalRoutes.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
)

app.use(express.json({ limit: "10mb" }))

app.use(compression())

app.use("/uploads", express.static(path.join(__dirname, "../uploads")))

app.get("/", (req, res) => {
  res.send("Svasthya Connect Backend Running")
})

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/appointments", appointmentRoutes)
app.use("/api/report", reportRoutes)
app.use("/api/ai", reportRoutes)
app.use("/api/aiRecomend", reportRoutes)
app.use("/api/doctors", doctorRoutes)
app.use("/api/hospitals", hospitalRoutes)

app.get("/api/health", (req, res) => {
  res.json({ status: "API working OK" })
})

export default app