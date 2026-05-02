import Hospital from "../models/Hospital.js"

export const getHospitals = async (req, res) => {
  try {
    const { city, page = 1, limit = 10 } = req.query
    const filter = {}
    if (city) filter.city = city

    const skip = (parseInt(page) - 1) * parseInt(limit)

    const [hospitals, total] = await Promise.all([
      Hospital.find(filter)
        .sort({ name: 1 })
        .skip(skip)
        .limit(parseInt(limit))
        .select("name city address phone ambulance lat lng type emergency departments"),
      Hospital.countDocuments(filter)
    ])

    res.json({
      hospitals,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      hasMore: skip + hospitals.length < total,
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getHospitalById = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id)
    if (!hospital) return res.status(404).json({ message: "Hospital not found" })
    res.json(hospital)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getCities = async (req, res) => {
  try {
    const cities = await Hospital.distinct("city")
    res.json(cities)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getDepartmentsByHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id)
    if (!hospital) return res.status(404).json({ message: "Hospital not found" })
    res.json(hospital.departments)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
