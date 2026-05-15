import { useState, useEffect } from "react"
import { useNavigate, Link, useLocation } from "react-router-dom"
import axios from "axios"
import { getRedirectPath, clearRedirectPath } from "../utils/auth"

// ── helpers ────────────────────────────────────────────────────────────────
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateLogin(email, password) {
  const errs = {}
  if (!email.trim()) {
    errs.email = "Email is required"
  } else if (!emailRegex.test(email.trim())) {
    errs.email = "Enter a valid email address"
  }
  if (!password) {
    errs.password = "Password is required"
  } else if (password.length < 6) {
    errs.password = "Password must be at least 6 characters"
  }
  return errs
}

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || "/dashboard"

  // These store what the user types
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("patient")

  // For showing errors and loading state
  const [errors, setErrors]   = useState({})   // field-level errors
  const [error, setError]     = useState("")    // server error
  const [loading, setLoading] = useState(false)

  // Clear a single field error as the user starts correcting it
  const clearErr = (field) =>
    setErrors((prev) => ({ ...prev, [field]: "" }))

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")

    // ── client-side validation ────────────────────────────────────────────
    const errs = validateLogin(email, password)
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    setErrors({})
    setLoading(true)

    try {
      // Call your backend login API
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
        role, // Send role for consistency
      })

      // Backend sends back a token — save it in localStorage
      localStorage.setItem("token", res.data.token)

      // Also save user name so Dashboard can show it
      localStorage.setItem("user", JSON.stringify(res.data.user))

      // Check for redirect path
      const redirectPath = getRedirectPath()
      
      if (redirectPath) {
        clearRedirectPath()
        navigate(redirectPath)
      } else {
        // Go to intended page or dashboard after successful login
        navigate(from)
      }

    } catch (err) {
      // Show error message if login fails
      setError(err.response?.data?.message || "Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10">
      <div className="bg-white p-10 rounded-[32px] shadow-2xl shadow-gray-200 border border-gray-100 w-full max-w-md">

        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 mx-auto mb-4 border border-teal-100 shadow-sm">
             <h1 className="text-3xl">🩺</h1>
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Svasthya<span className="text-teal-600">Connect</span></h1>
          <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-1">Digital Health Network</p>
        </div>

        {/* ROLE SELECTOR */}
        <div className="flex bg-gray-50 p-1.5 rounded-2xl mb-8 border border-gray-100">
           {["patient", "doctor", "hospital"].map((r) => (
             <button
               key={r}
               type="button"
               onClick={() => setRole(r)}
               className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                 role === r 
                   ? "bg-white text-teal-600 shadow-sm border border-gray-100 scale-100" 
                   : "text-gray-400 hover:text-gray-600 scale-95"
               }`}
             >
               {r}
             </button>
           ))}
        </div>

        {/* REDIRECT MESSAGE */}
        {location.state?.message && (
          <div className="bg-blue-50 border border-blue-100 text-blue-600 px-4 py-3 rounded-xl mb-6 text-xs font-bold flex items-center gap-2">
            <span className="animate-pulse">?</span>
            {location.state.message}
          </div>
        )}

        {/* SERVER ERROR MESSAGE */}
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-6 text-xs font-bold">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleLogin} className="flex flex-col gap-5" noValidate>

          {/* Email */}
          <div>
            <label className="text-gray-700 font-medium text-sm">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); clearErr("email") }}
              placeholder="you@example.com"
              className={`w-full border px-4 py-2 rounded-lg mt-1 focus:outline-none ${
                errors.email
                  ? "border-red-400 focus:border-red-400"
                  : "focus:border-teal-500"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-gray-700 font-medium text-sm">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); clearErr("password") }}
              placeholder="Enter your password"
              className={`w-full border px-4 py-2 rounded-lg mt-1 focus:outline-none ${
                errors.password
                  ? "border-red-400 focus:border-red-400"
                  : "focus:border-teal-500"
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
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