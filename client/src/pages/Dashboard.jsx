import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"

export default function Dashboard() {
  const navigate = useNavigate()

  // Get user info that was saved during login
  const user = JSON.parse(localStorage.getItem("user") || "{}")

  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  // When page loads, fetch this user's appointments from backend
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token")

        const res = await axios.get("http://localhost:5000/api/appointments/my", {
          headers: {
            // Send token so backend knows who is asking
            Authorization: `Bearer ${token}`,
          },
        })

        setAppointments(res.data)
      } catch (err) {
        console.error("Could not fetch appointments", err)
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, []) // empty array means run only once when page loads

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/login")
  }

  return (
    <div className="bg-gray-50 min-h-screen px-10 py-8">

      {/* TOP HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome, {user.name || "Patient"} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {user.city || "Jharkhand"} | {user.email}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="border border-red-400 text-red-400 px-4 py-2 rounded-lg hover:bg-red-50 transition"
        >
          Logout
        </button>
      </div>

      {/* QUICK ACTION CARDS */}
      <div className="grid grid-cols-4 gap-5 mb-10">
        <QuickCard
          icon="📅"
          title="Book Appointment"
          desc="Find doctors near you"
          path="/appointment"
        />
        <QuickCard
          icon="💻"
          title="Video Consult"
          desc="Consult from home"
          path="/video-consult"
        />
        <QuickCard
          icon="📄"
          title="Upload Report"
          desc="Get AI analysis"
          path="/upload-report"
        />
        <QuickCard
          icon="🤖"
          title="AI Recommendations"
          desc="Doctor suggestions"
          path="/ai-recommend"
        />
      </div>

      {/* MY APPOINTMENTS */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-gray-800">My Appointments</h2>
          <Link
            to="/appointment"
            className="text-teal-600 text-sm font-medium hover:underline"
          >
            + Book New
          </Link>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <p className="text-gray-400 text-center py-10">
            Loading appointments...
          </p>
        )}

        {/* EMPTY STATE */}
        {!loading && appointments.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-400 text-lg mb-3">No appointments yet</p>
            <Link
              to="/appointment"
              className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition"
            >
              Book your first appointment
            </Link>
          </div>
        )}

        {/* APPOINTMENTS LIST */}
        {!loading && appointments.length > 0 && (
          <div className="flex flex-col gap-4">
            {appointments.map((appt) => (
              <AppointmentCard key={appt._id} appt={appt} />
            ))}
          </div>
        )}
      </div>

    </div>
  )
}

// ─── QUICK ACTION CARD ────────────────────────────────────────────────────────
function QuickCard({ icon, title, desc, path }) {
  const navigate = useNavigate()
  return (
    <div
      onClick={() => navigate(path)}
      className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:border-teal-400 hover:shadow-md transition"
    >
      <div className="text-3xl mb-2">{icon}</div>
      <h3 className="font-semibold text-gray-800">{title}</h3>
      <p className="text-gray-400 text-sm mt-1">{desc}</p>
    </div>
  )
}

// ─── SINGLE APPOINTMENT CARD ──────────────────────────────────────────────────
function AppointmentCard({ appt }) {

  // Color the status badge based on value
  const statusColor = {
    pending:   "bg-yellow-100 text-yellow-700",
    confirmed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
    completed: "bg-gray-100 text-gray-600",
  }

  return (
    <div className="border border-gray-100 rounded-xl p-5 flex justify-between items-center hover:border-teal-300 transition">

      {/* LEFT — doctor and hospital info */}
      <div>
        <h3 className="font-semibold text-gray-800">
          {appt.doctorName || "Doctor"}
        </h3>
        <p className="text-gray-500 text-sm mt-1">
          {appt.speciality} • {appt.hospital}
        </p>
        <p className="text-gray-400 text-sm mt-1">
          📅 {new Date(appt.date).toLocaleDateString("en-IN", {
            weekday: "short",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
          {" "} at {appt.time}
        </p>
      </div>

      {/* RIGHT — status badge */}
      <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColor[appt.status] || "bg-gray-100 text-gray-600"}`}>
        {appt.status?.charAt(0).toUpperCase() + appt.status?.slice(1)}
      </span>

    </div>
  )
}