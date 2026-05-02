import { Link, useNavigate } from "react-router-dom"

function Navbar() {
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const user = JSON.parse(localStorage.getItem("user") || "{}")

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/login")
  }

  return (
    <div className="flex justify-between items-center px-10 py-4 bg-white shadow-sm sticky top-0 z-50">

      {/* LOGO */}
      <Link to="/" className="flex items-center gap-3">
  <img
    src="/logo.jpeg"
    alt="Svasthya Connect"
    className="h-12 w-12 rounded-full object-contain"
  />
  <div>
    <h1 className="text-xl font-bold text-teal-600">Svasthya Connect</h1>
    <p className="text-xs text-gray-400">Seamless Health, Continuous Care</p>
  </div>
</Link>

      {/* NAV LINKS */}
      <div className="flex gap-5 text-gray-700 font-medium text-sm">
        <Link to="/" className="hover:text-teal-600">Home</Link>
        <Link to="/nearby" className="hover:text-teal-600">📍 Nearby</Link>
        <Link to="/appointment" className="hover:text-teal-600">Book</Link>
        <Link to="/video-consult" className="hover:text-teal-600">Consult</Link>
        <Link to="/ai-recommend" className="hover:text-teal-600">AI & Reports</Link>
        <Link to="/medicines" className="hover:text-teal-600">Medicines</Link>
        <Link to="/ambulance" className="hover:text-teal-600 text-red-500 font-bold">🚑 Emergency</Link>
      </div>

      {/* RIGHT SIDE */}
      {token ? (
        <div className="flex gap-3 items-center">
          {/* Profile avatar — shows initials */}
          <Link to="/profile">
            <div className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-sm hover:ring-2 hover:ring-teal-400 transition">
              {user.name?.charAt(0).toUpperCase() || "P"}
            </div>
          </Link>
          <Link to="/dashboard" className="text-teal-600 font-medium hover:underline text-sm">
            Dashboard
          </Link>
          <button
            onClick={handleLogout}
            className="border border-red-400 text-red-400 px-3 py-1 rounded-lg hover:bg-red-50 text-sm transition"
          >
            Logout
          </button>
        </div>
      ) : (
        <Link to="/login">
          <button className="border border-teal-600 text-teal-600 px-4 py-1 rounded-lg hover:bg-teal-50 text-sm">
            Login / Signup
          </button>
        </Link>
      )}

    </div>
  )
}

export default Navbar