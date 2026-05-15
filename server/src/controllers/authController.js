import User from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const registerUser = async (req, res) => {
  try {
    const {
      name, email, password, phone,
      age, gender, bloodGroup,
      address, city, pincode,
      emergencyContact, allergies, existingConditions,
      role
    } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" })
    }

    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: "User already exists with this email" })
    }

    const user = await User.create({
      name, email, password, phone,
      age, gender, bloodGroup,
      address, city, pincode,
      emergencyContact, allergies, existingConditions,
      role: role || "patient"
    })

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

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

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
