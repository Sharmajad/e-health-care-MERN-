/**
 * ================================================================
 * AUTH CONTROLLER — controllers/authController.js
 * ================================================================
 * Handles user registration and login.
 *
 * registerUser → POST /api/auth/register
 *   - Validates required fields (name, email, password)
 *   - Checks for duplicate email
 *   - Creates the user (password is hashed by the User model pre-save hook)
 *   - Returns a JWT (7-day expiry) + user profile
 *
 * loginUser → POST /api/auth/login
 *   - Validates credentials
 *   - Compares provided password against stored bcrypt hash
 *   - Returns a JWT (7-day expiry) + user profile
 * ================================================================
 */

import User from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

/**
 * POST /api/auth/register
 * Creates a new user account and returns a signed JWT.
 */
export const registerUser = async (req, res) => {
  try {
    const {
      name, email, password, phone,
      age, gender, bloodGroup,
      address, city, pincode,
      emergencyContact, allergies, existingConditions,
      role
    } = req.body

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" })
    }

    // Prevent duplicate accounts
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: "User already exists with this email" })
    }

    // Create the user — password will be auto-hashed by the pre-save hook
    const user = await User.create({
      name, email, password, phone,
      age, gender, bloodGroup,
      address, city, pincode,
      emergencyContact, allergies, existingConditions,
      role: role || "patient"
    })

    // Sign a JWT containing the user id and role
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        age: user.age,
        gender: user.gender,
        bloodGroup: user.bloodGroup,
        address: user.address,
        city: user.city,
        pincode: user.pincode,
        emergencyContact: user.emergencyContact,
        allergies: user.allergies,
        existingConditions: user.existingConditions,
        role: user.role,
      }
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/**
 * POST /api/auth/login
 * Authenticates an existing user and returns a signed JWT.
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" })
    }

    // Look up the user by email
    const user = await User.findOne({ email })
    if (!user) {
      // Use generic message to avoid revealing whether the email exists
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Compare the plaintext password against the stored bcrypt hash
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Issue a new JWT for the session
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        age: user.age,
        gender: user.gender,
        bloodGroup: user.bloodGroup,
        address: user.address,
        city: user.city,
        pincode: user.pincode,
        emergencyContact: user.emergencyContact,
        allergies: user.allergies,
        existingConditions: user.existingConditions,
        role: user.role,
      }
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
