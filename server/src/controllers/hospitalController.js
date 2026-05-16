/**
 * ================================================================
 * HOSPITAL CONTROLLER — controllers/hospitalController.js
 * ================================================================
 * Handles fetching hospital records with optional geo-sorting.
 *
 * getHospitals           GET /api/hospitals
 *   Returns a paginated list of hospitals.
 *   - With lat/lng: fetches ALL hospitals, computes Haversine distance,
 *     sorts nearest-first, then paginates in memory.
 *   - Without lat/lng: uses MongoDB .sort({ popularity: -1 }) and
 *     standard skip/limit for efficient DB-side pagination.
 *
 * getHospitalById        GET /api/hospitals/:id
 *   Returns a single hospital by its ObjectId.
 *
 * getCities              GET /api/hospitals/cities
 *   Returns the list of distinct city names (for dropdowns/filters).
 *
 * getDepartmentsByHospital GET /api/hospitals/:id/departments
 *   Returns the departments array for a specific hospital.
 * ================================================================
 */

import Hospital from "../models/Hospital.js"

/**
 * GET /api/hospitals
 * Returns hospitals filtered by city, optionally sorted by proximity.
 */
export const getHospitals = async (req, res) => {
  try {
    const { city, page = 1, limit = 10, lat, lng } = req.query
    const filter = {}
    if (city) filter.city = city

    const skip = (parseInt(page) - 1) * parseInt(limit)
    const limitNum = parseInt(limit)

    let hospitals, total;

    if (lat && lng) {
      // ── Geo-sort path ─────────────────────────────────────────
      // Must fetch all matching hospitals first to compute distances,
      // since MongoDB doesn't natively support Haversine sorting
      // without a geospatial index (2dsphere).
      const userLat = parseFloat(lat)
      const userLng = parseFloat(lng)

      const allHospitals = await Hospital.find(filter)
        .select("name city address phone ambulance lat lng type emergency departments image popularity")
        .lean()  // .lean() returns plain objects for faster processing

      const withDistance = allHospitals.map(h => {
        // Assign a huge distance if coordinates are missing
        if (!h.lat || !h.lng) return { ...h, distance: 9999 }

        // Haversine formula — distance in kilometres
        const dLat = (h.lat - userLat) * Math.PI / 180
        const dLng = (h.lng - userLng) * Math.PI / 180
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(userLat * Math.PI / 180) * Math.cos(h.lat * Math.PI / 180) *
                  Math.sin(dLng/2) * Math.sin(dLng/2)
        const distance = (6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))).toFixed(1)
        return { ...h, distance: parseFloat(distance) }
      })

      // Primary sort: nearest first; tie-break: most popular
      withDistance.sort((a, b) => {
        if (a.distance !== b.distance) return a.distance - b.distance
        return (b.popularity || 0) - (a.popularity || 0)
      })

      total = withDistance.length
      hospitals = withDistance.slice(skip, skip + limitNum)  // Paginate in memory

    } else {
      // ── Standard path — DB-side sort + pagination ────────────
      // Most popular hospitals appear first by default
      ;[hospitals, total] = await Promise.all([
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

/**
 * GET /api/hospitals/:id
 * Fetches a single hospital record by its MongoDB ObjectId.
 */
export const getHospitalById = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id)
    if (!hospital) return res.status(404).json({ message: "Hospital not found" })
    res.json(hospital)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/**
 * GET /api/hospitals/cities
 * Returns an array of unique city names present in the database.
 * Used to populate the city filter dropdown in the frontend.
 */
export const getCities = async (req, res) => {
  try {
    const cities = await Hospital.distinct("city")
    res.json(cities)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/**
 * GET /api/hospitals/:id/departments
 * Returns the list of department names for a specific hospital.
 * Used to populate speciality dropdowns when a hospital is selected.
 */
export const getDepartmentsByHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id)
    if (!hospital) return res.status(404).json({ message: "Hospital not found" })
    res.json(hospital.departments)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
