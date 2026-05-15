import Hospital from "../models/Hospital.js"

export const getHospitals = async (req, res) => {
  try {
    const { city, page = 1, limit = 10, lat, lng } = req.query
    const filter = {}
    if (city) filter.city = city

    const skip = (parseInt(page) - 1) * parseInt(limit)
    const limitNum = parseInt(limit)

    let hospitals, total;

    if (lat && lng) {
      const userLat = parseFloat(lat)
      const userLng = parseFloat(lng)

      // Fetch all hospitals to calculate distance
      const allHospitals = await Hospital.find(filter)
        .select("name city address phone ambulance lat lng type emergency departments image popularity")
        .lean()
      
      const withDistance = allHospitals.map(h => {
        if (!h.lat || !h.lng) return { ...h, distance: 9999 }
        
        const dLat = (h.lat - userLat) * Math.PI / 180
        const dLng = (h.lng - userLng) * Math.PI / 180
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
                  Math.cos(userLat * Math.PI / 180) * Math.cos(h.lat * Math.PI / 180) * 
                  Math.sin(dLng/2) * Math.sin(dLng/2)
        const distance = (6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))).toFixed(1)
        return { ...h, distance: parseFloat(distance) }
      })

      // Sort by distance first, then popularity
      withDistance.sort((a, b) => {
        if (a.distance !== b.distance) return a.distance - b.distance
        return (b.popularity || 0) - (a.popularity || 0)
      })

      total = withDistance.length
      hospitals = withDistance.slice(skip, skip + limitNum)
    } else {
      // Standard fetch - Primary sort by popularity
      [hospitals, total] = await Promise.all([
        Hospital.find(filter)
          .sort({ popularity: -1, name: 1 })
          .skip(skip)
          .limit(limitNum)
          .select("name city address phone ambulance lat lng type emergency departments image popularity")
          .lean(),
        Hospital.countDocuments(filter)
      ])
    }

    res.json({
      hospitals,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limitNum),
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
