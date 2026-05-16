/**
 * ================================================================
 * AUTH MIDDLEWARE — middleware/authMiddleware.js
 * ================================================================
 * Protects routes that require the user to be logged in.
 *
 * How it works:
 *  1. Reads the Authorization header (Bearer <token>)
 *  2. Verifies the JWT using JWT_SECRET from .env
 *  3. Loads the matching User from MongoDB (without the password)
 *  4. Attaches the user object to req.user so controllers can use it
 *  5. Calls next() to pass control to the route handler
 *
 * Returns 401 if the token is missing, invalid, or the user is deleted.
 * ================================================================
 */

import jwt from "jsonwebtoken"
import User from "../models/User.js"

/**
 * Express middleware — verifies the JWT and populates req.user.
 * Use on any route that requires authentication.
 */
const protect = async (req, res, next) => {
  try {
    let token

    // Extract the token from the "Authorization: Bearer <token>" header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1]
    }

    // Reject the request if no token is present
    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" })
    }

    // Verify the token signature and decode the payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Fetch the user from the database (exclude the hashed password)
    req.user = await User.findById(decoded.id).select("-password")

    // Guard against tokens for deleted accounts
    if (!req.user) {
      return res.status(401).json({ message: "User not found" })
    }

    // Token is valid — proceed to the route handler
    next()

  } catch (error) {
    // Covers expired tokens, tampered tokens, etc.
    res.status(401).json({ message: "Not authorized, token failed" })
  }
}

export default protect
