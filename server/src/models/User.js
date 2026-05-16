/**
 * ================================================================
 * USER MODEL — models/User.js
 * ================================================================
 * Mongoose schema for patient (and future doctor/admin) accounts.
 *
 * Fields:
 *  - name, email, password  → core identity (email must be unique)
 *  - phone, age, gender, bloodGroup → medical profile basics
 *  - address, city, pincode → location details
 *  - allergies, existingConditions → health history (free text)
 *  - emergencyContact → nested object with name + phone
 *  - role → "patient" | "doctor" | "hospital" | "admin"
 *
 * Password is automatically hashed with bcrypt (salt rounds = 10)
 * via a pre-save hook before it is ever stored in the database.
 * ================================================================
 */

import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true },
    email:    { type: String, required: true, unique: true },
    password: { type: String, required: true },  // Stored as bcrypt hash
    phone:    { type: String },
    age:      { type: Number },
    gender:   { type: String },
    bloodGroup: { type: String },
    address:  { type: String },
    city:     { type: String },
    pincode:  { type: String },
    allergies: { type: String },
    existingConditions: { type: String },
    emergencyContact: {
      name:  { type: String },
      phone: { type: String },
    },
    role: {
      type: String,
      enum: ["patient", "doctor", "hospital", "admin"],
      default: "patient",
    },
  },
  { timestamps: true }  // Adds createdAt and updatedAt automatically
)

/**
 * Pre-save hook: hashes the password before storing it.
 * Only runs when the password field has been modified to avoid
 * double-hashing on profile updates.
 */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

const User = mongoose.model("User", userSchema)
export default User
