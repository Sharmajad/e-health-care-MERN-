import { useState, useEffect, useCallback, useRef } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { MapPin, Phone, Navigation, Clock, Globe, Star, MessageSquare, Video, ChevronLeft, ChevronRight, Building, CalendarCheck2 } from "lucide-react"

// LEAFLET IMPORTS
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default Leaflet icon paths in Vite/React
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});
L.Marker.prototype.options.icon = DefaultIcon;

const UserIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #0d9488; width: 15px; height: 15px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3); animation: pulse 2s infinite;"></div>`,
  iconSize: [15, 15],
  iconAnchor: [7, 7]
});

const API = "http://localhost:5000/api"

// Component to capture map clicks and update the search location
function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click: (e) => {
      onLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

// Component to programmatically update map center and zoom
function ChangeView({ center, zoom }) {
  const map = useMap();
  const lastCenterRef = useRef(null);

  useEffect(() => {
    const centerStr = JSON.stringify(center);
    if (lastCenterRef.current !== centerStr) {
      map.setView(center, zoom);
      lastCenterRef.current = centerStr;
    }
  }, [center, zoom, map]);
  return null;
}

export default function NearbyServices() {
  const navigate = useNavigate()
  const [location, setLocation] = useState(null)
  const [locating, setLocating] = useState(false)
  const [activeTab, setActiveTab] = useState("hospitals")

  // DATA STATES
  const [hospitals, setHospitals] = useState([])
  const [doctors, setDoctors] = useState([])
  const [allHospitals, setAllHospitals] = useState([]) // For global map markers
  const [allDoctors, setAllDoctors] = useState([])    // For global map markers

  const [hPage, setHPage] = useState(1)
  const [dPage, setDPage] = useState(1)
  const [hTotal, setHTotal] = useState(0)
  const [dTotal, setDTotal] = useState(0)
  const [hPages, setHPages] = useState(1)
  const [dPages, setDPages] = useState(1)

  const [fetching, setFetching] = useState(true)
  const [cities, setCities] = useState([])
  const [selectedCity, setSelectedCity] = useState("")
  const [locError, setLocError] = useState(null)

  const [hasAttemptedLoc, setHasAttemptedLoc] = useState(false)
  const defaultCenter = [22.8046, 86.2029] // Jamshedpur (TMH coordinates)

  // Main function to fetch hospitals and doctors based on location/city
  const fetchData = useCallback(async () => {
    // If we haven't even tried to get location yet, wait
    if (!hasAttemptedLoc) return

    setFetching(true)
    try {
      const locQuery = location ? `&lat=${location.lat}&lng=${location.lng}` : ""
      const cityQuery = selectedCity ? `&city=${selectedCity}` : ""

      // Fetch Paginated List (Top 10 nearest)
      const hUrl = `${API}/hospitals?page=${hPage}&limit=10${locQuery}${cityQuery}`
      const dUrl = `${API}/doctors?page=${dPage}&limit=10${locQuery}${cityQuery}`

      // Fetch All Data for Map Pins (unpaginated for the map)
      const hAllUrl = `${API}/hospitals?limit=500${locQuery}${cityQuery}`
      const dAllUrl = `${API}/doctors?limit=1000${locQuery}${cityQuery}`

      const [hRes, dRes, hAllRes, dAllRes] = await Promise.all([
        axios.get(hUrl),
        axios.get(dUrl),
        axios.get(hAllUrl),
        axios.get(dAllUrl)
      ])

      setHospitals(hRes.data.hospitals || [])
      setHTotal(hRes.data.total || 0)
      setHPages(hRes.data.pages || 1)

      setDoctors(dRes.data.doctors || [])
      setDTotal(dRes.data.total || 0)
      setDPages(dRes.data.pages || 1)

      setAllHospitals(hAllRes.data.hospitals || [])
      setAllDoctors(dAllRes.data.doctors || [])

    } catch (error) {
      console.error("Fetch error:", error)
    } finally {
      setFetching(false)
    }
  }, [hPage, dPage, location, selectedCity, hasAttemptedLoc])

  const fetchCities = async () => {
    try {
      const res = await axios.get(`${API}/hospitals/cities`)
      setCities(res.data)
    } catch (err) {
      console.error("Cities fetch error:", err)
    }
  }

  useEffect(() => {
    fetchCities()
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Detect user's current GPS position
  const getLocation = () => {
    setLocating(true)
    setLocError(null)
    setSelectedCity("") // Clear city to prioritize actual location results
    if (!navigator.geolocation) { 
      setLocError("Geolocation not supported")
      setLocating(false); 
      setHasAttemptedLoc(true)
      return 
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setLocation(newLoc)
        setLocating(false)
        setHasAttemptedLoc(true)
        setHPage(1)
        setDPage(1)
      },
      (err) => { 
        setLocating(false)
        setLocError(err.message || "Access denied")
        setHasAttemptedLoc(true)
      },
      { timeout: 10000, enableHighAccuracy: true }
    )
  }

  useEffect(() => { 
    getLocation() 
  }, [])

  return (
    <div className="h-[calc(100vh-64px)] bg-gray-50 flex flex-col overflow-hidden">

      {/* ── SLIM HEADER ── */}
      <div className="bg-white border-b border-gray-100 py-3 px-6 shrink-0">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
            <MapPin className="text-teal-600 w-6 h-6" /> Nearby Finder
          </h1>

          <div className="flex items-center gap-3">
            <select 
              value={selectedCity} 
              onChange={(e) => { setSelectedCity(e.target.value); setHPage(1); setDPage(1); }}
              className="bg-gray-100 border-none rounded-xl px-4 py-2 text-[10px] font-bold text-gray-700 outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
            >
              <option value="">All Cities</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <div className={`px-4 py-1.5 rounded-full flex items-center gap-2 border transition-all ${locError ? "bg-red-50 border-red-100" : location ? "bg-teal-50 border-teal-100" : "bg-orange-50 border-orange-100"
              }`}>
              <MapPin className={locError ? "text-red-500" : location ? "text-teal-600" : "text-orange-500"} size={14} />
              <p className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">
                {locError ? "GPS Denied" : location ? `${location.lat.toFixed(2)}N, ${location.lng.toFixed(2)}E` : "Awaiting GPS..."}
              </p>
              <button onClick={getLocation} disabled={locating} title="Retry GPS" className="ml-1 hover:text-teal-600 transition-all">
                <Globe className={locating ? "animate-spin" : ""} size={14} />
              </button>
            </div>

            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button onClick={() => setActiveTab("hospitals")} className={`px-6 py-1.5 rounded-lg text-[10px] font-bold transition-all ${activeTab === "hospitals" ? "bg-white text-teal-600 shadow-sm" : "text-gray-500"}`}>
                HOSPITALS
              </button>
              <button onClick={() => setActiveTab("doctors")} className={`px-6 py-1.5 rounded-lg text-[10px] font-bold transition-all ${activeTab === "doctors" ? "bg-white text-teal-600 shadow-sm" : "text-gray-500"}`}>
                SPECIALISTS
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── 50/50 SPLIT AREA ── */}
      <div className="flex-1 flex overflow-hidden">

        {/* LEFT: LIST (50%) */}
        <div className="w-1/2 bg-white border-r border-gray-100 flex flex-col h-full overflow-hidden">
          <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center shrink-0">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[2px]">
              Top 10 Nearest ({activeTab === "hospitals" ? hTotal : dTotal} Total)
            </span>
            <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded">
              Page {activeTab === "hospitals" ? hPage : dPage}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5 scrollbar-thin scrollbar-thumb-teal-100 relative">
            {(fetching || locating) && (
              <div className="absolute inset-0 bg-white/80 z-20 flex flex-col items-center justify-center backdrop-blur-sm">
                <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-xs font-black text-teal-600 uppercase tracking-[3px] animate-pulse">
                  {locating ? "Detecting Your Location..." : "Finding Nearby Services..."}
                </p>
                {locating && <p className="text-[10px] text-gray-400 mt-2">Please allow GPS access for better results</p>}
              </div>
            )}

            {activeTab === "hospitals" && (
              hospitals.length > 0 ? (
                hospitals.map((h) => (
                  <div key={h._id} className="group border border-gray-100 rounded-2xl p-4 hover:border-teal-400 hover:shadow-xl hover:shadow-teal-50/50 transition-all bg-gray-50/30">
                    <div className="flex gap-4 items-center mb-4">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-teal-50 flex items-center justify-center text-teal-600 shrink-0 border border-teal-100 shadow-sm">
                        <Building size={28} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-gray-900 text-sm group-hover:text-teal-600 transition-colors leading-tight">{h.name}</h3>
                          {(h.distance !== undefined && h.distance !== null) && h.distance < 9000 && <span className="bg-teal-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded ml-2">{h.distance} km</span>}
                        </div>
                        <p className="text-[10px] text-gray-500 flex items-center gap-1.5 mt-1"><MapPin size={12} className="text-gray-400" /> {h.address}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <a href={`tel:${h.phone}`} className="flex-1 bg-teal-600 text-white py-2.5 rounded-xl text-[10px] font-bold text-center hover:bg-teal-700 transition-all flex items-center justify-center gap-1">
                          <Phone size={12} /> Call Hospital
                        </a>
                        <a href={`https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lng}`} target="_blank" rel="noreferrer" className="flex-1 bg-white border border-teal-200 text-teal-600 py-2.5 rounded-xl text-[10px] font-bold text-center hover:bg-teal-50 transition-all">
                          Directions
                        </a>
                      </div>
                      <button 
                        onClick={() => navigate("/appointment", { state: { hospital: h.name, city: h.city } })}
                        className="w-full bg-gray-900 text-white py-2.5 rounded-xl text-[10px] font-bold text-center hover:bg-black transition-all flex items-center justify-center gap-1"
                      >
                        <CalendarCheck2 size={12} /> Book Appointment
                      </button>
                    </div>
                  </div>
                ))
              ) : !fetching && (
                <div className="text-center py-20">
                  <MapPin size={40} className="mx-auto text-gray-200 mb-4" />
                  <p className="text-gray-500 font-bold">No hospitals found in this area.</p>
                  <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">Try selecting another city or granting GPS access.</p>
                </div>
              )
            )}

            {activeTab === "doctors" && doctors.map((d) => (
              <div key={d._id} className="group border border-gray-100 rounded-2xl p-5 hover:border-teal-400 hover:shadow-xl hover:shadow-teal-50/50 transition-all bg-gray-50/30">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-teal-50 flex items-center justify-center text-teal-600 font-bold text-lg shadow-lg shadow-teal-100 border border-teal-50">
                    <span>{d.name?.[0]}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-sm group-hover:text-teal-600 transition-colors">{d.name}</h3>
                    <p className="text-teal-600 text-[10px] font-black uppercase tracking-wider">{d.speciality}</p>
                    <div className="flex items-center gap-1.5 mt-1 text-[11px] text-gray-500">
                      <Building size={14} className="text-gray-400" /> {d.hospital || "Medical Center"}
                    </div>
                  </div>
                  <div className="text-right">
                    {(d.distance !== undefined && d.distance !== null) && d.distance < 9000 && <p className="text-teal-600 text-[10px] font-black">{d.distance} km</p>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate("/appointment", {
                      state: {
                        fromAI: true,
                        doctor: d,
                        city: d.city,
                        hospital: d.hospital
                      }
                    })}
                    className="flex-1 bg-teal-600 text-white py-2.5 rounded-xl text-[10px] font-bold text-center hover:bg-teal-700 transition-all flex items-center justify-center gap-1 shadow-lg shadow-teal-100"
                  >
                    <CalendarCheck2 size={12} /> Book Visit
                  </button>
                  <a
                    href={d.lat && d.lng
                      ? `https://www.google.com/maps/dir/?api=1&destination=${d.lat},${d.lng}`
                      : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(d.hospital + " " + (d.city || ""))}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 bg-white border border-teal-200 text-teal-600 py-2.5 rounded-xl text-[10px] font-bold text-center hover:bg-teal-50 transition-all flex items-center justify-center gap-1"
                  >
                    <Navigation size={12} /> Directions
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-100 bg-white flex gap-3 shrink-0">
            <button
              disabled={activeTab === "hospitals" ? hPage <= 1 : dPage <= 1}
              onClick={() => activeTab === "hospitals" ? setHPage(hPage - 1) : setDPage(dPage - 1)}
              className="flex-1 flex items-center justify-center gap-2 border border-gray-200 py-2.5 rounded-xl text-[11px] font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-20 transition-all"
            >
              <ChevronLeft size={14} /> Previous
            </button>
            <button
              disabled={activeTab === "hospitals" ? hPage >= hPages : dPage >= dPages}
              onClick={() => activeTab === "hospitals" ? setHPage(hPage + 1) : setDPage(dPage + 1)}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white py-2.5 rounded-xl text-[11px] font-bold hover:bg-black disabled:opacity-20 transition-all shadow-lg shadow-gray-200"
            >
              Next Page <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* RIGHT: MAP (50%) */}
        <div className="w-1/2 relative bg-gray-100 h-full">
          <MapContainer
            center={location ? [location.lat, location.lng] : defaultCenter}
            zoom={13}
            style={{ height: '100%', width: '100%', zIndex: 0 }}
          >
            <TileLayer
              attribution='&copy; Google Maps'
              url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
            />

            {location && (
              <>
                <ChangeView center={[location.lat, location.lng]} zoom={13} />
                <MapClickHandler onLocationSelect={(loc) => {
                  setLocation(loc);
                  setHPage(1);
                  setDPage(1);
                }} />
                <Marker position={[location.lat, location.lng]} icon={UserIcon}>
                  <Popup>
                    <div className="text-center p-2">
                      <p className="font-black text-teal-600 text-[10px] uppercase tracking-tighter">Your Location</p>
                      <p className="text-[9px] text-gray-500 font-bold">Click anywhere on map to refine</p>
                    </div>
                  </Popup>
                </Marker>
              </>
            )}

            {/* MAP SHOWS ALL DOCTORS/HOSPITALS FROM DATABASE */}
            {activeTab === "hospitals" && allHospitals.filter(h => h.lat && h.lng).map(h => (
              <Marker key={h._id} position={[h.lat, h.lng]}>
                <Popup>
                  <div className="p-1 min-w-[180px]">
                    <h4 className="font-bold text-gray-800 text-xs">{h.name}</h4>
                    <p className="text-[10px] text-gray-500 mb-2">{h.address}</p>
                    <div className="flex flex-col gap-1.5">
                      <a href={`https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lng}`} target="_blank" rel="noreferrer" className="block bg-teal-600 text-white text-center py-1.5 rounded-[6px] text-[10px] font-bold no-underline">Get Directions</a>
                      <button 
                        onClick={() => navigate("/appointment", { state: { hospital: h.name, city: h.city } })}
                        className="w-full bg-gray-900 text-white py-1.5 rounded-[6px] text-[10px] font-bold text-center"
                      >
                        Book Appointment
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* DOCTORS ON MAP */}
            {activeTab === "doctors" && allDoctors.filter(d => d.lat && d.lng).map(d => (
              <Marker key={d._id} position={[d.lat, d.lng]}>
                <Popup>
                  <div className="p-1 text-center min-w-[150px]">
                    <h4 className="font-bold text-gray-800 text-xs">{d.name}</h4>
                    <p className="text-teal-600 text-[10px] font-bold mb-1">{d.speciality}</p>
                    <p className="text-[10px] text-gray-500 italic mb-2">at {d.hospital}</p>
                    <button 
                      onClick={() => navigate("/appointment", { state: { doctorId: d._id, doctorName: d.name, speciality: d.speciality, hospital: d.hospital, city: d.city } })}
                      className="w-full bg-teal-600 text-white py-1.5 rounded-[6px] text-[10px] font-bold text-center"
                    >
                      Book Visit
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          <div className="absolute top-4 right-4 z-[400] bg-white/80 backdrop-blur-md px-3 py-2 rounded-xl shadow-lg border border-white flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Global Jharkhand Network</p>
            </div>
            {location && <p className="text-[8px] text-teal-600 font-bold animate-bounce">Click map to refine your location</p>}
          </div>
        </div>

      </div>
    </div>
  )
}
