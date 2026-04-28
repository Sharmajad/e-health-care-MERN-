import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true },
    email:    { type: String, required: true, unique: true },
    password: { type: String, required: true },
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
      enum: ["patient", "doctor", "admin"],
      default: "patient",
    },
  },
  { timestamps: true }
)

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

const User = mongoose.model("User", userSchema)
export default User
