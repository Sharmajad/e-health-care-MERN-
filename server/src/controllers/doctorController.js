import Doctor from "../models/Doctor.js"

export const getDoctors = async (req, res) => {
  try {
    const { city, speciality, hospital, page = 1, limit = 10, lat, lng } = req.query
    const filter = {}
    if (city)       filter.city = { $regex: city, $options: 'i' }
    if (speciality) filter.speciality = { $regex: speciality, $options: 'i' }
    if (hospital)   filter.hospital = hospital

    const skip = (parseInt(page) - 1) * parseInt(limit)
    const limitNum = parseInt(limit)

    // Using aggregation to join with Hospital for lat/lng
    const pipeline = [
      { $match: filter },
      {
        $lookup: {
          from: "hospitals",
          localField: "hospital",
          foreignField: "name",
          as: "hospitalInfo"
        }
      },
      {
        $project: {
          name: 1, speciality: 1, hospital: 1, hospitalId: 1, 
          city: 1, experience: 1, fee: 1, rating: 1, 
          available: 1, phone: 1, about: 1, languages: 1, 
          image: 1, slots: 1,
          hLat: { $arrayElemAt: ["$hospitalInfo.lat", 0] },
          hLng: { $arrayElemAt: ["$hospitalInfo.lng", 0] }
        }
      }
    ]

    const allDoctors = await Doctor.aggregate(pipeline)
    
    let processedDoctors = allDoctors;

    // Map hLat/hLng to lat/lng for consistent frontend usage
    processedDoctors = allDoctors.map(d => ({
      ...d,
      lat: d.hLat || null,
      lng: d.hLng || null
    }))

    if (lat && lng) {
      const userLat = parseFloat(lat)
      const userLng = parseFloat(lng)

      processedDoctors = processedDoctors.map(d => {
        if (!d.lat || !d.lng) return { ...d, distance: 9999 }

        const radLat = (d.lat - userLat) * Math.PI / 180
        const radLng = (d.lng - userLng) * Math.PI / 180
        const a = Math.sin(radLat/2) * Math.sin(radLat/2) + 
                  Math.cos(userLat * Math.PI / 180) * Math.cos(d.lat * Math.PI / 180) * 
                  Math.sin(radLng/2) * Math.sin(radLng/2)
        const distance = (6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))).toFixed(1)
        return { ...d, distance: parseFloat(distance) }
      })

      processedDoctors.sort((a, b) => {
        if (a.distance !== b.distance) return a.distance - b.distance
        return (b.rating || 0) - (a.rating || 0)
      })
    } else {
      // Default sort by rating if no location provided
      processedDoctors.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    }

    const total = processedDoctors.length
    const paginated = processedDoctors.slice(skip, skip + limitNum)

    res.json({
      doctors: paginated,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limitNum),
      hasMore: skip + paginated.length < total,
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
