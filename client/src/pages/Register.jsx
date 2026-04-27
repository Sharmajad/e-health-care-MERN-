import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"

export default function Register() {
  const navigate = useNavigate()

  // Store what user types
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [city, setCity] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")

  // UI states
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const cities = ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Hazaribagh", "Deoghar", "Giridih", "Dumka"]

  const handleRegister = async (e) => {
    e.preventDefault()
    setError("")

    // Check passwords match before calling backend
    if (password !== confirm) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)

    try {
      // Call your backend register API
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        phone,
        city,
        password,
      })

      // Save token and user just like Login does
      localStorage.setItem("token", res.data.token)
      localStorage.setItem("user", JSON.stringify(res.data.user))

      // Go to dashboard after successful registration
      navigate("/dashboard")

    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10">
      <div className="bg-white p-10 rounded-2xl shadow-md w-full max-w-md">

        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-teal-600">🩺 Svasthya Connect</h1>
          <p className="text-gray-500 mt-1">Create your patient account</p>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="bg-red-50 border border-red-300 text-red-600 px-4 py-3 rounded-lg mb-5 text-sm">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleRegister} className="flex flex-col gap-5">

          {/* Full Name */}
          <div>
            <label className="text-gray-700 font-medium text-sm">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Rahul Kumar"
              required
              className="w-full border px-4 py-2 rounded-lg mt-1 focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-gray-700 font-medium text-sm">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full border px-4 py-2 rounded-lg mt-1 focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-gray-700 font-medium text-sm">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="9876543210"
              required
              className="w-full border px-4 py-2 rounded-lg mt-1 focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* City */}
          <div>
            <label className="text-gray-700 font-medium text-sm">Your City</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              className="w-full border px-4 py-2 rounded-lg mt-1 focus:outline-none focus:border-teal-500 text-gray-700"
            >
              <option value="">Select your city</option>
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Password */}
          <div>
            <label className="text-gray-700 font-medium text-sm">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              required
              className="w-full border px-4 py-2 rounded-lg mt-1 focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-gray-700 font-medium text-sm">Confirm Password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Re-enter your password"
              required
              className="w-full border px-4 py-2 rounded-lg mt-1 focus:outline-none focus:border-teal-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg font-medium transition disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Register"}
          </button>

        </form>

        {/* LINK TO LOGIN */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-teal-600 font-medium hover:underline">
            Login here
          </Link>
        </p>

      </div>
    </div>
  )
}