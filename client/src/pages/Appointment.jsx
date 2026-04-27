import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

export default function Appointment() {
  const navigate = useNavigate()

  // Get logged in user from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}")

  // Form fields
  const [city, setCity] = useState("")
  const [hospital, setHospital] = useState("")
  const [speciality, setSpeciality] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")

  // UI states
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // ── DATA ──────────────────────────────────────────────────────────────────
  const cities = [
    "Ranchi", "Jamshedpur", "Dhanbad", "Bokaro",
    "Hazaribagh", "Deoghar", "Giridih", "Dumka"
  ]

  const hospitalsByCity = {
    Ranchi:      ["RIMS", "Medanta Hospital Ranchi", "AIIMS Ranchi", "CIP Kanke", "Orchid Medical Centre"],
    Jamshedpur:  ["Tata Main Hospital (TMH)", "MGM Medical College Hospital", "Brahmanand Narayana Hospital"],
    Dhanbad:     ["SNMMCH Saraidhela", "PMCH Dhanbad", "Apollo Clinic Dhanbad"],
    Bokaro:      ["Bokaro General Hospital", "SAIL Bokaro Steel Hospital", "Uma Super Speciality Hospital"],
    Hazaribagh:  ["Sadar Hospital Hazaribagh", "Hazaribagh Medical College"],
    Deoghar:     ["AIIMS Deoghar", "Sadar Hospital Deoghar", "Shree Salasar Hospital"],
    Giridih:     ["Sadar Hospital Giridih"],
    Dumka:       ["Phulo Jhano Medical College", "Sadar Hospital Dumka"],
  }

  const specialities = [
    "General Physician", "Cardiologist", "Neurologist",
    "Orthopedist", "Gynecologist", "Pediatrician",
    "Dermatologist", "Psychiatrist", "Oncologist",
    "Nephrologist", "Ophthalmologist", "ENT Specialist",
  ]

  const slots = [
    "09:00 AM", "10:00 AM", "11:00 AM",
    "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"
  ]

  // ── SUBMIT ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    // Make sure user selected a time slot
    if (!time) {
      setError("Please select a time slot")
      return
    }

    setLoading(true)

    try {
      const token = localStorage.getItem("token")

      // Send appointment data to backend
      await axios.post(
        "http://localhost:5000/api/appointments",
        {
          patientName: user.name,
          city,
          hospital,
          speciality,
          date,
          time,
        },
        {
          headers: {
            // Token proves the user is logged in
            Authorization: `Bearer ${token}`,
          },
        }
      )

      // Show success message
      setSuccess(true)

    } catch (err) {
      setError(err.response?.data?.message || "Booking failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // ── SUCCESS SCREEN ────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-md p-10 text-center max-w-md">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Appointment Booked!</h2>
          <p className="text-gray-500 mb-2">{hospital}</p>
          <p className="text-gray-500 mb-2">{speciality}</p>
          <p className="text-teal-600 font-medium mb-6">
            {new Date(date).toLocaleDateString("en-IN", {
              weekday: "long", day: "numeric",
              month: "long", year: "numeric"
            })} at {time}
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  // ── MAIN FORM ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md p-8">

        {/* HEADER */}
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Book Appointment</h1>
        <p className="text-gray-400 text-sm mb-8">
          Find and book doctors across Jharkhand
        </p>

        {/* ERROR */}
        {error && (
          <div className="bg-red-50 border border-red-300 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          {/* Patient Name — auto filled from login */}
          <div>
            <label className="text-gray-700 font-medium text-sm">Patient Name</label>
            <input
              type="text"
              value={user.name || ""}
              readOnly
              className="w-full border px-4 py-2 rounded-lg mt-1 bg-gray-50 text-gray-500"
            />
          </div>

          {/* City */}
          <div>
            <label className="text-gray-700 font-medium text-sm">Select City</label>
            <select
              value={city}
              onChange={(e) => {
                setCity(e.target.value)
                setHospital("") // reset hospital when city changes
              }}
              required
              className="w-full border px-4 py-2 rounded-lg mt-1 focus:outline-none focus:border-teal-500 text-gray-700"
            >
              <option value="">Select your city</option>
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Hospital — depends on selected city */}
          <div>
            <label className="text-gray-700 font-medium text-sm">Select Hospital</label>
            <select
              value={hospital}
              onChange={(e) => setHospital(e.target.value)}
              required
              disabled={!city}
              className="w-full border px-4 py-2 rounded-lg mt-1 focus:outline-none focus:border-teal-500 text-gray-700 disabled:bg-gray-100"
            >
              <option value="">
                {city ? "Select hospital" : "Select city first"}
              </option>
              {(hospitalsByCity[city] || []).map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </div>

          {/* Speciality */}
          <div>
            <label className="text-gray-700 font-medium text-sm">Select Speciality</label>
            <select
              value={speciality}
              onChange={(e) => setSpeciality(e.target.value)}
              required
              className="w-full border px-4 py-2 rounded-lg mt-1 focus:outline-none focus:border-teal-500 text-gray-700"
            >
              <option value="">Select speciality</option>
              {specialities.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="text-gray-700 font-medium text-sm">Select Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              // Prevent selecting past dates
              min={new Date().toISOString().split("T")[0]}
              required
              className="w-full border px-4 py-2 rounded-lg mt-1 focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Time Slots */}
          <div>
            <label className="text-gray-700 font-medium text-sm mb-2 block">
              Select Time Slot
            </label>
            <div className="flex flex-wrap gap-3">
              {slots.map((slot) => (
                <button
                  type="button"
                  key={slot}
                  onClick={() => setTime(slot)}
                  className={`px-4 py-2 rounded-lg border font-medium text-sm transition ${
                    time === slot
                      ? "bg-teal-600 text-white border-teal-600"
                      : "border-gray-300 text-gray-600 hover:border-teal-400"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-50 mt-2"
          >
            {loading ? "Booking..." : "Confirm Appointment"}
          </button>

        </form>
      </div>
    </div>
  )
}