
import Hospital from "../models/Hospital.js"

export const getHospitals = async (req, res) => {
  try {
    const { city } = req.query
    const filter = {}
    if (city) filter.city = city
    const hospitals = await Hospital.find(filter).sort({ name: 1 })
    res.json(hospitals)
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
