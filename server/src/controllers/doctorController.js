import Doctor from "../models/Doctor.js"

export const getDoctors = async (req, res) => {
  try {
    const { city, speciality, hospital, page = 1, limit = 12 } = req.query
    const filter = {}
    if (city)       filter.city = city
    if (speciality) filter.speciality = speciality
    if (hospital)   filter.hospital = hospital

    const skip = (parseInt(page) - 1) * parseInt(limit)

    const [doctors, total] = await Promise.all([
      Doctor.find(filter)
        .sort({ rating: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .select("name speciality hospital city experience fee rating available phone about"),
      Doctor.countDocuments(filter)
    ])

    res.json({
      doctors,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      hasMore: skip + doctors.length < total,
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
    if (!doctor) return res.status(404).json({ message: "Doctor not found" })
    res.json(doctor)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const addDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.create(req.body)
    res.status(201).json(doctor)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
