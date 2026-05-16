/**
 * ================================================================
 * USER CONTROLLER — controllers/userController.js
 * ================================================================
 * Handles updating the authenticated user's profile.
 *
 * updateUserProfile  PUT /api/users/update
 *   Accepts any combination of profile fields in req.body and
 *   applies them with $set. Intentionally blocks changes to
 *   password, email, and role — those require dedicated flows.
 * ================================================================
 */

import User from "../models/User.js"

/**
 * PUT /api/users/update
 * Partially updates the profile of the authenticated user.
 * Password, email, and role are protected and cannot be changed here.
 */
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id
    const updates = req.body

    // Strip sensitive fields — these must be changed through dedicated endpoints
    delete updates.password
    delete updates.email
    delete updates.role

    // Apply the remaining fields and return the updated document (without the password hash)
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Return the full updated profile so the frontend can refresh its local state
    res.json({
      message: "Profile updated successfully",
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
