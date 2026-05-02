
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const API = "http://localhost:5000/api"

const slots = ["09:00 AM","10:00 AM","11:00 AM","12:00 PM","02:00 PM","03:00 PM","04:00 PM"]

export default function Appointment() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user") || "{}")

  const [step, setStep] = useState(1)

  const [cities, setCities] = useState([])
  const [hospitals, setHospitals] = useState([])
  const [departments, setDepartments] = useState([])
  const [doctors, setDoctors] = useState([])

  const [city, setCity] = useState("")
  const [hospital, setHospital] = useState(null)
  const [speciality, setSpeciality] = useState("")
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [consultType, setConsultType] = useState("inperson")

  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)

  useEffect(() => {
    axios.get(API + "/hospitals/cities")
      .then((res) => setCities(res.data))
      .catch(() => setCities(["Ranchi","Jamshedpur","Dhanbad","Bokaro","Hazaribagh","Deoghar","Giridih","Dumka"]))
  }, [])

 useEffect(() => {
  if (!city) return
  setFetching(true)
  setHospital(null)
  setSpeciality("")
  axios.get(API + "/hospitals?city=" + city + "&limit=10")
    .then((res) => setHospitals(res.data.hospitals || res.data))
    .catch(() => setHospitals([]))
    .finally(() => setFetching(false))
}, [city])

  useEffect(() => {
    if (!hospital) return
    setDepartments(hospital.departments || [])
    setSpeciality("")
  }, [hospital])

  useEffect(() => {
  if (!hospital || !speciality) return
  setFetching(true)
  axios.get(API + "/doctors?hospital=" + encodeURIComponent(hospital.name) + "&speciality=" + encodeURIComponent(speciality) + "&limit=8")
    .then((res) => setDoctors(res.data.doctors || res.data))
    .catch(() => setDoctors([]))
    .finally(() => setFetching(false))
}, [hospital, speciality])

  const handleSubmit = async () => {
    if (!time) { setError("Please select a time slot"); return }
    if (!date) { setError("Please select a date"); return }
    setLoading(true)
    setError("")
    try {
      const token = localStorage.getItem("token")
      await axios.post(
        API + "/appointments",
        {
          patientName: user.name,
          city,
          hospital: hospital.name,
          speciality,
          doctorName: selectedDoctor.name,
          date, time, consultType,
          fee: selectedDoctor.fee,
        },
        { headers: { Authorization: "Bearer " + token } }
      )
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-md p-10 text-center max-w-md w-full">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Appointment Booked!</h2>
          <div className="bg-teal-50 rounded-xl p-4 mb-6 text-left text-sm flex flex-col gap-1">
            <p><span className="font-medium text-gray-700">Doctor:</span> {selectedDoctor.name}</p>
            <p><span className="font-medium text-gray-700">Hospital:</span> {hospital.name}</p>
            <p><span className="font-medium text-gray-700">Department:</span> {speciality}</p>
            <p><span className="font-medium text-gray-700">Date:</span> {new Date(date).toLocaleDateString("en-IN", { weekday:"long", day:"numeric", month:"long", year:"numeric" })}</p>
            <p><span className="font-medium text-gray-700">Time:</span> {time}</p>
            <p><span className="font-medium text-gray-700">Type:</span> {consultType === "inperson" ? "In-Person" : consultType === "video" ? "Video Call" : "WhatsApp"}</p>
            <p className="text-teal-600 font-semibold">Fee: Rs.{selectedDoctor.fee}</p>
          </div>
          <button onClick={() => navigate("/dashboard")} className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition w-full">
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Book an Appointment</h1>
          <p className="text-gray-400 mt-1">Find the right doctor across Jharkhand</p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-8">
          {["Select Hospital","Choose Doctor","Confirm Booking"].map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className={"w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold " + (step > i+1 ? "bg-green-500 text-white" : step === i+1 ? "bg-teal-600 text-white" : "bg-gray-200 text-gray-500")}>
                  {step > i+1 ? "✓" : i+1}
                </div>
                <span className={"text-xs font-medium hidden sm:block " + (step === i+1 ? "text-teal-600" : "text-gray-400")}>{label}</span>
              </div>
              {i < 2 && <div className={"h-0.5 w-8 " + (step > i+1 ? "bg-teal-500" : "bg-gray-200")} />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-md p-8">
            <h2 className="text-lg font-bold text-gray-800 mb-6">Step 1 — Select Hospital and Department</h2>
            <div className="flex flex-col gap-5">

              <div>
                <label className="text-gray-700 font-medium text-sm">City</label>
                <select value={city} onChange={(e) => setCity(e.target.value)}
                  className="w-full border px-4 py-2 rounded-lg mt-1 focus:outline-none focus:border-teal-500 text-gray-700">
                  <option value="">Select city</option>
                  {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {city && (
                <div>
                  <label className="text-gray-700 font-medium text-sm">Hospital</label>
                  {fetching ? <p className="text-gray-400 text-sm mt-2">Loading hospitals...</p> : (
                    <div className="flex flex-col gap-2 mt-2">
                      {hospitals.map((h) => (
                        <div key={h._id} onClick={() => setHospital(h)}
                          className={"border rounded-xl p-4 cursor-pointer transition " + (hospital?._id === h._id ? "border-teal-500 bg-teal-50" : "border-gray-100 hover:border-teal-300")}>
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold text-gray-800">{h.name}</p>
                              <p className="text-gray-400 text-xs mt-0.5">{h.address}</p>
                            </div>
                            <div className="flex gap-1 flex-wrap justify-end">
                              <span className={"text-xs px-2 py-0.5 rounded-full " + (h.type === "Government" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700")}>{h.type}</span>
                              {h.emergency && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">24/7 Emergency</span>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {hospital && (
                <div>
                  <label className="text-gray-700 font-medium text-sm">Department</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                    {departments.map((dept) => (
                      <button type="button" key={dept} onClick={() => setSpeciality(dept)}
                        className={"px-3 py-2 rounded-xl border text-sm font-medium transition text-left " + (speciality === dept ? "bg-teal-600 text-white border-teal-600" : "border-gray-200 text-gray-600 hover:border-teal-400 hover:bg-teal-50")}>
                        {dept}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button onClick={() => setStep(2)} disabled={!city || !hospital || !speciality}
                className="bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-40 mt-2">
                View Available Doctors →
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-md p-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-800">Step 2 — Choose Your Doctor</h2>
                <p className="text-gray-400 text-sm mt-1">{speciality} at {hospital.name}</p>
              </div>
              <button onClick={() => setStep(1)} className="text-teal-600 text-sm hover:underline">← Change</button>
            </div>

            {fetching ? <p className="text-gray-400 text-center py-8">Loading doctors...</p> : doctors.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">No doctors found for {speciality} at {hospital.name}</p>
                <button onClick={() => setStep(1)} className="mt-3 text-teal-600 text-sm hover:underline">Try another department</button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {doctors.map((doc) => (
                  <div key={doc._id} onClick={() => setSelectedDoctor(doc)}
                    className={"border rounded-xl p-5 cursor-pointer transition " + (selectedDoctor?._id === doc._id ? "border-teal-500 bg-teal-50" : "border-gray-100 hover:border-teal-300")}>
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-lg shrink-0">
                        {doc.name.split(" ").map((n) => n[0]).join("").slice(0,2)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{doc.name}</h3>
                        <p className="text-teal-600 text-sm">{doc.speciality}</p>
                        <p className="text-gray-400 text-xs mt-1">{doc.experience} years experience · ⭐ {doc.rating}</p>
                        <p className="text-gray-400 text-xs mt-0.5">{doc.about}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-gray-800 font-bold">Rs.{doc.fee}</p>
                        <p className="text-gray-400 text-xs">per visit</p>
                        <span className={"text-xs px-2 py-0.5 rounded-full mt-1 inline-block " + (doc.available ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500")}>
                          {doc.available ? "Available" : "Busy"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button onClick={() => setStep(3)} disabled={!selectedDoctor}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-40 mt-6">
              Continue to Booking →
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white rounded-2xl shadow-md p-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-800">Step 3 — Confirm Booking</h2>
                <p className="text-gray-400 text-sm mt-1">{selectedDoctor?.name} · {hospital.name}</p>
              </div>
              <button onClick={() => setStep(2)} className="text-teal-600 text-sm hover:underline">← Change Doctor</button>
            </div>

            <div className="flex flex-col gap-5">
              <div>
                <label className="text-gray-700 font-medium text-sm">Consultation Type</label>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  {[
                    { value: "inperson", label: "In-Person", desc: "Visit hospital", icon: "🏥" },
                    { value: "video",    label: "Video Call", desc: "Online consult", icon: "💻" },
                    { value: "whatsapp", label: "WhatsApp",   desc: "Phone consult", icon: "📱" },
                  ].map((t) => (
                    <button type="button" key={t.value} onClick={() => setConsultType(t.value)}
                      className={"border rounded-xl p-3 text-center transition " + (consultType === t.value ? "border-teal-500 bg-teal-50" : "border-gray-200 hover:border-teal-300")}>
                      <p className="text-xl mb-1">{t.icon}</p>
                      <p className="font-medium text-sm text-gray-800">{t.label}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{t.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-gray-700 font-medium text-sm">Select Date</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]} required
                  className="w-full border px-4 py-2 rounded-lg mt-1 focus:outline-none focus:border-teal-500" />
              </div>

              <div>
                <label className="text-gray-700 font-medium text-sm mb-2 block">Select Time Slot</label>
                <div className="flex flex-wrap gap-3">
                  {slots.map((slot) => (
                    <button type="button" key={slot} onClick={() => setTime(slot)}
                      className={"px-4 py-2 rounded-lg border font-medium text-sm transition " + (time === slot ? "bg-teal-600 text-white border-teal-600" : "border-gray-300 text-gray-600 hover:border-teal-400")}>
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 text-sm flex flex-col gap-1">
                <h3 className="font-semibold text-gray-800 mb-2">Booking Summary</h3>
                <div className="flex justify-between"><span className="text-gray-500">Patient</span><span>{user.name}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Doctor</span><span>{selectedDoctor?.name}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Hospital</span><span>{hospital.name}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Department</span><span>{speciality}</span></div>
                <div className="flex justify-between border-t border-gray-200 pt-2 mt-1">
                  <span className="font-semibold text-gray-800">Fee</span>
                  <span className="font-bold text-teal-600">Rs.{selectedDoctor?.fee}</span>
                </div>
              </div>

              {error && <div className="bg-red-50 border border-red-300 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>}

              <button onClick={handleSubmit} disabled={loading}
                className="bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-50">
                {loading ? "Booking..." : "Confirm Appointment"}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
