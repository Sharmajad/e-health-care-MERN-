
import Doctor from "../models/Doctor.js"

export const getDoctors = async (req, res) => {
  try {
    const { city, speciality, hospital } = req.query

    const filter = {}

    if (city) {
      filter.city = { $regex: city, $options: "i" }
    }

    if (speciality) {
      filter.speciality = { $regex: speciality, $options: "i" }
    }

    if (hospital) {
      filter.hospital = { $regex: hospital, $options: "i" }
    }

    const doctors = await Doctor.find(filter).sort({ rating: -1 })

    res.json(doctors)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
