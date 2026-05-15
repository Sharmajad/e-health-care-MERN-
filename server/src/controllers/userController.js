import User from "../models/User.js"

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id
    const updates = req.body

    // Don't allow password or email updates through this endpoint for now
    delete updates.password
    delete updates.email
    delete updates.role

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

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
