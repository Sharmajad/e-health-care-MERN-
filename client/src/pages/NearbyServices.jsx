import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function NearbyServices() {
  const navigate = useNavigate()
  const [location, setLocation] = useState(null)
  const [locationError, setLocationError] = useState("")
  const [locating, setLocating] = useState(false)
  const [activeTab, setActiveTab] = useState("hospitals")

  const allHospitals = [
    { id: 1,  name: "RIMS",                        city: "Ranchi",     address: "Bariatu Road, Ranchi",        phone: "0651-2451070", lat: 23.3561, lng: 85.3096, type: "Government", emergency: true  },
    { id: 2,  name: "Medanta Hospital Ranchi",      city: "Ranchi",     address: "Jail Road, Ranchi",           phone: "0651-3520000", lat: 23.3441, lng: 85.3096, type: "Private",     emergency: true  },
    { id: 3,  name: "AIIMS Ranchi",                 city: "Ranchi",     address: "Tupudana, Ranchi",            phone: "0651-2451100", lat: 23.3200, lng: 85.2800, type: "Government", emergency: true  },
    { id: 4,  name: "CIP Kanke",                    city: "Ranchi",     address: "Kanke Road, Ranchi",          phone: "0651-2451082", lat: 23.3900, lng: 85.3200, type: "Government", emergency: false },
    { id: 5,  name: "Orchid Medical Centre",        city: "Ranchi",     address: "Circular Road, Ranchi",       phone: "0651-2331122", lat: 23.3600, lng: 85.3300, type: "Private",     emergency: true  },
    { id: 6,  name: "Tata Main Hospital (TMH)",     city: "Jamshedpur", address: "C Road, Bistupur",            phone: "0657-2428570", lat: 22.8046, lng: 86.2029, type: "Private",     emergency: true  },
    { id: 7,  name: "MGM Medical College Hospital", city: "Jamshedpur", address: "Dimna Road, Mango",           phone: "0657-2387100", lat: 22.8200, lng: 86.2200, type: "Government", emergency: true  },
    { id: 8,  name: "Brahmanand Narayana Hospital", city: "Jamshedpur", address: "Adityapur, Jamshedpur",       phone: "0657-6677777", lat: 22.7800, lng: 86.1800, type: "Private",     emergency: true  },
    { id: 9,  name: "SNMMCH Saraidhela",            city: "Dhanbad",    address: "Saraidhela, Dhanbad",         phone: "0326-2310627", lat: 23.7957, lng: 86.4304, type: "Government", emergency: true  },
    { id: 10, name: "Bokaro General Hospital",      city: "Bokaro",     address: "Sector 4, Bokaro Steel City", phone: "06542-233100", lat: 23.6693, lng: 86.1511, type: "Government", emergency: true  },
  ]

  const allDoctors = [
    { id: 1, name: "Dr. Priya Sharma",  speciality: "Cardiologist",     city: "Ranchi",     hospital: "RIMS",                   lat: 23.3561, lng: 85.3096, phone: "9876543210", available: true  },
    { id: 2, name: "Dr. Amit Kumar",    speciality: "Neurologist",      city: "Jamshedpur", hospital: "Tata Main Hospital",      lat: 22.8046, lng: 86.2029, phone: "9876543211", available: true  },
    { id: 3, name: "Dr. Sunita Devi",   speciality: "Gynecologist",     city: "Ranchi",     hospital: "Medanta Ranchi",          lat: 23.3441, lng: 85.3096, phone: "9876543212", available: false },
    { id: 4, name: "Dr. Rakesh Singh",  speciality: "Pediatrician",     city: "Dhanbad",    hospital: "SNMMCH Dhanbad",         lat: 23.7957, lng: 86.4304, phone: "9876543213", available: true  },
    { id: 5, name: "Dr. Meera Kumari",  speciality: "Dermatologist",    city: "Bokaro",     hospital: "Bokaro General Hospital", lat: 23.6693, lng: 86.1511, phone: "9876543214", available: true  },
    { id: 6, name: "Dr. Vijay Mahato",  speciality: "General Physician",city: "Hazaribagh", hospital: "Sadar Hospital",         lat: 23.9925, lng: 85.3637, phone: "9876543215", available: true  },
    { id: 7, name: "Dr. Suresh Oraon",  speciality: "Orthopedist",      city: "Jamshedpur", hospital: "MGM Medical College",     lat: 22.8200, lng: 86.2200, phone: "9876543216", available: true  },
    { id: 8, name: "Dr. Anjali Gupta",  speciality: "Psychiatrist",     city: "Ranchi",     hospital: "CIP Kanke",              lat: 23.3900, lng: 85.3200, phone: "9876543217", available: false },
  ]

  const getDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLng = ((lng2 - lng1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
    return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1)
  }

  const getLocation = () => {
    setLocating(true)
    setLocationError("")
    if (!navigator.geolocation) {
      setLocationError("Browser does not support location access")
      setLocating(false)
      return
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({ lat: position.coords.latitude, lng: position.coords.longitude })
        setLocating(false)
      },
      () => {
        setLocationError("Location access denied. Please allow location in your browser.")
        setLocating(false)
      },
      { timeout: 10000 }
    )
  }

  useEffect(() => { getLocation() }, [])

  const withDistance = (arr) => {
    if (!location) return arr
    return [...arr]
      .map((item) => ({ ...item, distance: parseFloat(getDistance(location.lat, location.lng, item.lat, item.lng)) }))
      .sort((a, b) => a.distance - b.distance)
  }

  const hospitals = withDistance(allHospitals)
  const doctors = withDistance(allDoctors)

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-4xl mx-auto">

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">📍 Nearby Services</h1>
          <p className="text-gray-400 mt-2">Hospitals and doctors near your location in Jharkhand</p>
        </div>

        {/* LOCATION STATUS */}
        <div className={`rounded-2xl p-5 mb-8 flex items-center justify-between ${location ? "bg-green-50 border border-green-200" : "bg-yellow-50 border border-yellow-200"}`}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{location ? "✅" : "📍"}</span>
            <div>
              {locating && <p className="text-gray-600 font-medium">Detecting your location...</p>}
              {location && !locating && (
                <>
                  <p className="text-green-700 font-medium">Location detected</p>
                  <p className="text-green-600 text-sm">{location.lat.toFixed(4)}N, {location.lng.toFixed(4)}E — sorted by distance</p>
                </>
              )}
              {locationError && <p className="text-yellow-700 text-sm">{locationError}</p>}
            </div>
          </div>
          <button onClick={getLocation} disabled={locating}
            className="border border-teal-500 text-teal-600 px-4 py-2 rounded-lg text-sm hover:bg-teal-50 transition disabled:opacity-50">
            {locating ? "Detecting..." : "🔄 Refresh"}
          </button>
        </div>

        {/* TABS */}
        <div className="flex bg-white rounded-xl shadow-sm border border-gray-100 p-1 mb-6">
          <button onClick={() => setActiveTab("hospitals")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${activeTab === "hospitals" ? "bg-teal-600 text-white" : "text-gray-500 hover:text-teal-600"}`}>
            🏥 Hospitals ({hospitals.length})
          </button>
          <button onClick={() => setActiveTab("doctors")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${activeTab === "doctors" ? "bg-teal-600 text-white" : "text-gray-500 hover:text-teal-600"}`}>
            👨‍⚕️ Doctors ({doctors.length})
          </button>
        </div>

        {/* HOSPITALS */}
        {activeTab === "hospitals" && (
          <div className="flex flex-col gap-4">
            {hospitals.map((h) => (
              <div key={h.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:border-teal-300 transition">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-semibold text-gray-800">{h.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${h.type === "Government" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>
                        {h.type}
                      </span>
                      {h.emergency && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                          🚨 24/7 Emergency
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-sm">📍 {h.address}</p>
                    <p className="text-gray-500 text-sm mt-1">📞 {h.phone}</p>
                    {location && h.distance && (
                      <p className="text-teal-600 text-sm font-medium mt-2">🗺️ {h.distance} km away</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 ml-4 shrink-0">
                    <a href={`tel:${h.phone}`} className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-xs text-center transition">
                      📞 Call
                    </a>
                    <a href={`https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lng}`} target="_blank" rel="noreferrer"
                      className="border border-teal-500 text-teal-600 px-4 py-2 rounded-lg text-xs text-center hover:bg-teal-50 transition">
                      🗺️ Directions
                    </a>
                    <button onClick={() => navigate("/appointment")}
                      className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-xs hover:border-teal-400 transition">
                      📅 Book
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* DOCTORS */}
        {activeTab === "doctors" && (
          <div className="grid grid-cols-2 gap-4">
            {doctors.map((d) => (
              <div key={d.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:border-teal-300 transition">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold shrink-0">
                    {d.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-sm">{d.name}</h3>
                    <p className="text-teal-600 text-xs">{d.speciality}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${d.available ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {d.available ? "Available" : "Busy"}
                  </span>
                </div>
                <p className="text-gray-400 text-xs">🏥 {d.hospital}</p>
                <p className="text-gray-400 text-xs mt-1">📍 {d.city}</p>
                {location && d.distance && (
                  <p className="text-teal-600 text-xs font-medium mt-2">🗺️ {d.distance} km away</p>
                )}
                <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                  <a href={`tel:${d.phone}`} className="flex-1 bg-teal-600 text-white py-1.5 rounded-lg text-xs text-center hover:bg-teal-700 transition">
                    📞 Call
                  </a>
                  <a href={`https://wa.me/91${d.phone}`} target="_blank" rel="noreferrer"
                    className="flex-1 bg-green-500 text-white py-1.5 rounded-lg text-xs text-center hover:bg-green-600 transition">
                    💬 WhatsApp
                  </a>
                  <button onClick={() => navigate("/video-consult")}
                    className="flex-1 border border-teal-500 text-teal-600 py-1.5 rounded-lg text-xs hover:bg-teal-50 transition">
                    💻 Video
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}