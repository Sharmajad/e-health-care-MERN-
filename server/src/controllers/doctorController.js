/**
 * ================================================================
 * DOCTOR CONTROLLER — controllers/doctorController.js
 * ================================================================
 * Handles fetching and creating doctor records.
 *
 * getDoctors    GET /api/doctors
 *   Returns a paginated, filtered list of doctors.
 *   Supports optional geo-sorting (lat/lng query params):
 *     - With lat/lng → sorted by distance from the user (Haversine formula)
 *     - Without lat/lng → sorted by rating (highest first)
 *   Uses an aggregation $lookup to join hospital coordinates since
 *   doctors don't store lat/lng directly — they inherit it from
 *   their associated Hospital document.
 *
 * getDoctorById GET /api/doctors/:id
 *   Returns a single doctor by MongoDB ObjectId.
 *   (Route is currently commented out in doctorRoutes.js)
 *
 * addDoctor     POST /api/doctors
 *   Creates a new doctor record (admin use / seeding).
 *   (Route is currently commented out in doctorRoutes.js)
 * ================================================================
 */

import Doctor from "../models/Doctor.js"

/**
 * GET /api/doctors
 * Fetches doctors with optional city/speciality/hospital filters,
 * geo-distance sorting, and pagination.
 */
export const getDoctors = async (req, res) => {
  try {
    const { city, speciality, hospital, page = 1, limit = 10, lat, lng } = req.query

    // Build a dynamic filter from the provided query params
    const filter = {}
    if (city)       filter.city = { $regex: city, $options: 'i' }       // Case-insensitive city match
    if (speciality) filter.speciality = { $regex: speciality, $options: 'i' }
    if (hospital)   filter.hospital = hospital

    const skip = (parseInt(page) - 1) * parseInt(limit)
    const limitNum = parseInt(limit)

    // ── Aggregation Pipeline ──────────────────────────────────────
    // Join hospitals to get their lat/lng coordinates for distance calc.
    // Doctors are linked to hospitals by name (string), not ObjectId.
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
          // Flatten the first matched hospital's coordinates
          hLat: { $arrayElemAt: ["$hospitalInfo.lat", 0] },
          hLng: { $arrayElemAt: ["$hospitalInfo.lng", 0] }
        }
      }
    ]

    const allDoctors = await Doctor.aggregate(pipeline)

    // Remap hLat/hLng → lat/lng so the frontend receives a consistent shape
    let processedDoctors = allDoctors.map(d => ({
      ...d,
      lat: d.hLat || null,
      lng: d.hLng || null
    }))

    if (lat && lng) {
      // ── Geo-sort: Haversine distance from user's location ──────
      const userLat = parseFloat(lat)
      const userLng = parseFloat(lng)

      processedDoctors = processedDoctors.map(d => {
        // Assign a huge distance to doctors with no coordinates so they fall to the end
        if (!d.lat || !d.lng) return { ...d, distance: 9999 }

        // Haversine formula — returns distance in kilometres
        const radLat = (d.lat - userLat) * Math.PI / 180
        const radLng = (d.lng - userLng) * Math.PI / 180
        const a = Math.sin(radLat/2) * Math.sin(radLat/2) +
                  Math.cos(userLat * Math.PI / 180) * Math.cos(d.lat * Math.PI / 180) *
                  Math.sin(radLng/2) * Math.sin(radLng/2)
        const distance = (6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))).toFixed(1)
        return { ...d, distance: parseFloat(distance) }
      })

      // Primary sort: nearest first; secondary sort: highest rated
      processedDoctors.sort((a, b) => {
        if (a.distance !== b.distance) return a.distance - b.distance
        return (b.rating || 0) - (a.rating || 0)
      })
    } else {
      // No location provided — fall back to rating sort
      processedDoctors.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    }

    // ── Pagination (applied after sorting in memory) ──────────────
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

/**
 * GET /api/doctors/:id
 * Fetches a single doctor record by its MongoDB ObjectId.
 * (Route currently commented out in doctorRoutes.js)
 */
export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
    if (!doctor) return res.status(404).json({ message: "Doctor not found" })
    res.json(doctor)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/**
 * POST /api/doctors
 * Creates a new doctor record.
 * Intended for admin use or the seed script.
 * (Route currently commented out in doctorRoutes.js)
 */
export const addDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.create(req.body)
    res.status(201).json(doctor)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
