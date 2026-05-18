/**
 * ================================================================
 * SERVER ENTRY POINT — index.js
 * ================================================================
 * Bootstraps the Express application by:
 *  1. Connecting to MongoDB via connectDB()
 *  2. Starting the HTTP server on the configured PORT
 *  3. Handling port-already-in-use errors gracefully
 * ================================================================
 */

import dotenv from "dotenv";
dotenv.config();


import app from "./app.js"
import connectDB from "./config/db.js"

const startServer = async () => {
  // Connect to MongoDB before accepting any requests
  await connectDB()

  const PORT = process.env.PORT || 5000

  const server = app.listen(PORT, () => {
    console.log("Server running at http://localhost:" + PORT)
  })

  // Friendly error if the port is already occupied
  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") console.log("Port " + PORT + " busy. Kill it first.")
  })
}

startServer()
