import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"

export default function Login() {
  const navigate = useNavigate()

  // These store what the user types
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // For showing errors and loading state
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()   // stops page from refreshing on form submit
    setError("")
    setLoading(true)

    try {
      // Call your backend login API
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      })

      // Backend sends back a token — save it in localStorage
      localStorage.setItem("token", res.data.token)

      // Also save user name so Dashboard can show it
      localStorage.setItem("user", JSON.stringify(res.data.user))

      // Go to dashboard after successful login
      navigate("/dashboard")

    } catch (err) {
      // Show error message if login fails
      setError(err.response?.data?.message || "Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-10 rounded-2xl shadow-md w-full max-w-md">

        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-teal-600">🩺 Svasthya Connect</h1>
          <p className="text-gray-500 mt-1">Login to your account</p>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="bg-red-50 border border-red-300 text-red-600 px-4 py-3 rounded-lg mb-5 text-sm">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleLogin} className="flex flex-col gap-5">

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

          <div>
            <label className="text-gray-700 font-medium text-sm">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full border px-4 py-2 rounded-lg mt-1 focus:outline-none focus:border-teal-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg font-medium transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* LINK TO REGISTER */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-teal-600 font-medium hover:underline">
            Register here
          </Link>
        </p>

      </div>
    </div>
  )
}