import { useState, useEffect } from "react"

export default function Ambulance() {
  const [location, setLocation] = useState(null)
  const [locating, setLocating] = useState(false)
  const [nearestHospital, setNearestHospital] = useState(null)

  const nationalNumbers = [
    { name: "National Ambulance", number: "108",  desc: "Free government ambulance service", icon: "🚑" },
    { name: "Police",             number: "100",  desc: "For accidents and emergencies",      icon: "🚔" },
    { name: "Fire Brigade",       number: "101",  desc: "Fire and rescue emergencies",        icon: "🚒" },
    { name: "National Emergency", number: "112",  desc: "All-in-one emergency helpline",      icon: "🆘" },
    { name: "Women Helpline",     number: "1091", desc: "Women safety emergencies",           icon: "👩" },
    { name: "Child Helpline",     number: "1098", desc: "Child emergencies",                  icon: "👶" },
  ]

  const hospitals = [
    { id: 1,  name: "RIMS",                        city: "Ranchi",     phone: "0651-2451070", ambulance: "0651-2451071", lat: 23.3561, lng: 85.3096 },
    { id: 2,  name: "Medanta Hospital Ranchi",      city: "Ranchi",     phone: "0651-3520000", ambulance: "0651-3520001", lat: 23.3441, lng: 85.3096 },
    { id: 3,  name: "AIIMS Ranchi",                 city: "Ranchi",     phone: "0651-2451100", ambulance: "0651-2451101", lat: 23.3200, lng: 85.2800 },
    { id: 4,  name: "Tata Main Hospital (TMH)",     city: "Jamshedpur", phone: "0657-2428570", ambulance: "0657-2428571", lat: 22.8046, lng: 86.2029 },
    { id: 5,  name: "MGM Medical College",          city: "Jamshedpur", phone: "0657-2387100", ambulance: "0657-2387101", lat: 22.8200, lng: 86.2200 },
    { id: 6,  name: "Brahmanand Narayana Hospital", city: "Jamshedpur", phone: "0657-6677777", ambulance: "0657-6677778", lat: 22.7800, lng: 86.1800 },
    { id: 7,  name: "SNMMCH Saraidhela",            city: "Dhanbad",    phone: "0326-2310627", ambulance: "0326-2310628", lat: 23.7957, lng: 86.4304 },
    { id: 8,  name: "Bokaro General Hospital",      city: "Bokaro",     phone: "06542-233100", ambulance: "06542-233101", lat: 23.6693, lng: 86.1511 },
    { id: 9,  name: "Sadar Hospital Hazaribagh",    city: "Hazaribagh", phone: "06546-222344", ambulance: "06546-222345", lat: 23.9925, lng: 85.3637 },
    { id: 10, name: "AIIMS Deoghar",                city: "Deoghar",    phone: "06432-222100", ambulance: "06432-222101", lat: 24.4800, lng: 86.7000 },
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
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setLocation(coords)
        setLocating(false)
        const nearest = hospitals.reduce((closest, hospital) => {
          const dist = parseFloat(getDistance(coords.lat, coords.lng, hospital.lat, hospital.lng))
          return dist < closest.distance ? { ...hospital, distance: dist } : closest
        }, { distance: Infinity })
        setNearestHospital(nearest)
      },
      () => setLocating(false),
      { timeout: 10000 }
    )
  }

  useEffect(() => { getLocation() }, [])

  const sortedHospitals = location
    ? [...hospitals]
        .map((h) => ({ ...h, distance: parseFloat(getDistance(location.lat, location.lng, h.lat, h.lng)) }))
        .sort((a, b) => a.distance - b.distance)
    : hospitals

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-3xl mx-auto">

        {/* EMERGENCY HEADER */}
        <div className="bg-red-600 text-white rounded-2xl p-8 text-center mb-8">
          <div className="text-6xl mb-3">🚑</div>
          <h1 className="text-3xl font-bold mb-2">Emergency Services</h1>
          <p className="text-red-100 mb-6">Tap any number below to call immediately</p>
          <a
            href="tel:108"
            className="inline-block bg-white text-red-600 text-2xl font-bold px-12 py-4 rounded-2xl hover:bg-red-50 transition shadow-lg"
          >
            📞 Call 108 — Free Ambulance
          </a>
          <p className="text-red-200 text-sm mt-3">Available 24/7 · Completely Free · All of Jharkhand</p>
        </div>

        {/* NEAREST HOSPITAL */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">🏥 Nearest Hospital to You</h2>

          {locating && <p className="text-gray-400 text-center py-4">Detecting your location...</p>}

          {!locating && !nearestHospital && (
            <div className="text-center py-4">
              <p className="text-gray-400 mb-3">Location not detected</p>
              <button onClick={getLocation} className="border border-teal-500 text-teal-600 px-5 py-2 rounded-lg text-sm hover:bg-teal-50 transition">
                📍 Detect My Location
              </button>
            </div>
          )}

          {nearestHospital && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">{nearestHospital.name}</h3>
                  <p className="text-gray-500 text-sm mt-1">📍 {nearestHospital.city}</p>
                  <p className="text-red-600 font-semibold mt-1">🗺️ {nearestHospital.distance} km from you</p>
                </div>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${nearestHospital.lat},${nearestHospital.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="border border-teal-500 text-teal-600 px-3 py-2 rounded-lg text-xs hover:bg-teal-50 transition"
                >
                  🗺️ Directions
                </a>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <a href={`tel:${nearestHospital.ambulance}`} className="bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl text-center font-semibold transition">
                  🚑 Call Ambulance
                  <p className="text-xs font-normal mt-0.5 text-red-200">{nearestHospital.ambulance}</p>
                </a>
                <a href={`tel:${nearestHospital.phone}`} className="bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-xl text-center font-semibold transition">
                  📞 Call Hospital
                  <p className="text-xs font-normal mt-0.5 text-teal-200">{nearestHospital.phone}</p>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* NATIONAL NUMBERS */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-5">📞 National Emergency Numbers</h2>
          <div className="grid grid-cols-2 gap-4">
            {nationalNumbers.map((n) => (
              <a key={n.number} href={`tel:${n.number}`}
                className="flex items-center gap-4 border border-gray-100 rounded-xl p-4 hover:border-red-300 hover:bg-red-50 transition"
              >
                <span className="text-3xl">{n.icon}</span>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{n.name}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{n.desc}</p>
                </div>
                <span className="text-red-600 font-bold text-xl">{n.number}</span>
              </a>
            ))}
          </div>
        </div>

        {/* ALL HOSPITALS */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-5">🏥 All Hospital Ambulance Numbers</h2>
          <div className="flex flex-col gap-3">
            {sortedHospitals.map((h) => (
              <div key={h.id} className="flex items-center justify-between border border-gray-100 rounded-xl p-4 hover:border-red-200 transition">
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm">{h.name}</h3>
                  <p className="text-gray-400 text-xs mt-0.5">📍 {h.city}</p>
                  {h.distance && (
                    <p className="text-teal-600 text-xs mt-0.5">🗺️ {h.distance} km away</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <a href={`tel:${h.ambulance}`} className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-xs transition">
                    🚑 Ambulance
                  </a>
                  <a href={`tel:${h.phone}`} className="border border-gray-300 text-gray-600 px-3 py-2 rounded-lg text-xs hover:border-teal-400 transition">
                    📞 Hospital
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}