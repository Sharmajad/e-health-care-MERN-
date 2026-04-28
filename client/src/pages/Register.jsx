import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"

export default function Register() {
  const navigate = useNavigate()

  // ── STEP STATE — multi-step form ──────────────────────────────────────────
  // We split registration into 2 steps so it doesn't look overwhelming
  const [step, setStep] = useState(1)

  // ── STEP 1 FIELDS ─────────────────────────────────────────────────────────
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")

  // ── STEP 2 FIELDS ─────────────────────────────────────────────────────────
  const [age, setAge] = useState("")
  const [gender, setGender] = useState("")
  const [bloodGroup, setBloodGroup] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [pincode, setPincode] = useState("")
  const [emergencyName, setEmergencyName] = useState("")
  const [emergencyPhone, setEmergencyPhone] = useState("")
  const [allergies, setAllergies] = useState("")
  const [existingConditions, setExistingConditions] = useState("")

  // ── UI STATES ──────────────────────────────────────────────────────────────
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const cities = [
    "Ranchi", "Jamshedpur", "Dhanbad", "Bokaro",
    "Hazaribagh", "Deoghar", "Giridih", "Dumka"
  ]

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

  // ── STEP 1 VALIDATION — runs before moving to step 2 ──────────────────────
  const handleStep1 = (e) => {
    e.preventDefault()
    setError("")

    if (password !== confirm) {
      setError("Passwords do not match")
      return
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    // Move to step 2
    setStep(2)
  }

  // ── FINAL SUBMIT — runs on step 2 ─────────────────────────────────────────
  const handleRegister = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        // Step 1 data
        name,
        email,
        phone,
        password,
        // Step 2 data
        age,
        gender,
        bloodGroup,
        address,
        city,
        pincode,
        emergencyContact: {
          name: emergencyName,
          phone: emergencyPhone,
        },
        allergies,
        existingConditions,
      })

      // Save token and full user object
      localStorage.setItem("token", res.data.token)
      localStorage.setItem("user", JSON.stringify(res.data.user))

      navigate("/dashboard")

    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10">
      <div className="bg-white p-10 rounded-2xl shadow-md w-full max-w-lg">

        {/* HEADER */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-teal-600">🩺 Svasthya Connect</h1>
          <p className="text-gray-500 mt-1">Create your patient account</p>
        </div>

        {/* STEP INDICATOR */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            step >= 1 ? "bg-teal-600 text-white" : "bg-gray-200 text-gray-500"
          }`}>1</div>
          <div className={`h-1 w-16 rounded ${step >= 2 ? "bg-teal-600" : "bg-gray-200"}`} />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            step >= 2 ? "bg-teal-600 text-white" : "bg-gray-200 text-gray-500"
          }`}>2</div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-50 border border-red-300 text-red-600 px-4 py-3 rounded-lg mb-5 text-sm">
            {error}
          </div>
        )}

        {/* ── STEP 1 — Account Details ── */}
        {step === 1 && (
          <form onSubmit={handleStep1} className="flex flex-col gap-5">
            <p className="text-gray-500 text-sm font-medium">Step 1 of 2 — Account Details</p>

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
              className="bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg font-medium transition"
            >
              Next →
            </button>

            <p className="text-center text-gray-500 text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-teal-600 font-medium hover:underline">
                Login here
              </Link>
            </p>
          </form>
        )}

        {/* ── STEP 2 — Medical Details ── */}
        {step === 2 && (
          <form onSubmit={handleRegister} className="flex flex-col gap-5">
            <p className="text-gray-500 text-sm font-medium">Step 2 of 2 — Medical & Address Details</p>

            {/* Age and Gender side by side */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-700 font-medium text-sm">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="e.g. 28"
                  min="1" max="120"
                  required
                  className="w-full border px-4 py-2 rounded-lg mt-1 focus:outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="text-gray-700 font-medium text-sm">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                  className="w-full border px-4 py-2 rounded-lg mt-1 focus:outline-none focus:border-teal-500 text-gray-700"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Blood Group */}
            <div>
              <label className="text-gray-700 font-medium text-sm">Blood Group</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                required
                className="w-full border px-4 py-2 rounded-lg mt-1 focus:outline-none focus:border-teal-500 text-gray-700"
              >
                <option value="">Select blood group</option>
                {bloodGroups.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Address */}
            <div>
              <label className="text-gray-700 font-medium text-sm">Full Address</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House No., Street, Locality"
                required
                rows={2}
                className="w-full border px-4 py-2 rounded-lg mt-1 focus:outline-none focus:border-teal-500 resize-none"
              />
            </div>

            {/* City and Pincode side by side */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-700 font-medium text-sm">City</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  className="w-full border px-4 py-2 rounded-lg mt-1 focus:outline-none focus:border-teal-500 text-gray-700"
                >
                  <option value="">Select city</option>
                  {cities.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-gray-700 font-medium text-sm">Pincode</label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="834001"
                  required
                  className="w-full border px-4 py-2 rounded-lg mt-1 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-red-50 border border-red-100 rounded-xl p-4">
              <p className="text-red-600 font-medium text-sm mb-3">
                🆘 Emergency Contact
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-700 font-medium text-sm">Contact Name</label>
                  <input
                    type="text"
                    value={emergencyName}
                    onChange={(e) => setEmergencyName(e.target.value)}
                    placeholder="e.g. Sunita Devi"
                    required
                    className="w-full border px-4 py-2 rounded-lg mt-1 focus:outline-none focus:border-red-300"
                  />
                </div>
                <div>
                  <label className="text-gray-700 font-medium text-sm">Contact Phone</label>
                  <input
                    type="tel"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    placeholder="9876543210"
                    required
                    className="w-full border px-4 py-2 rounded-lg mt-1 focus:outline-none focus:border-red-300"
                  />
                </div>
              </div>
            </div>

            {/* Allergies */}
            <div>
              <label className="text-gray-700 font-medium text-sm">
                Known Allergies <span className="text-gray-400">(optional)</span>
              </label>
              <input
                type="text"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                placeholder="e.g. Penicillin, Dust, Peanuts"
                className="w-full border px-4 py-2 rounded-lg mt-1 focus:outline-none focus:border-teal-500"
              />
            </div>

            {/* Existing Conditions */}
            <div>
              <label className="text-gray-700 font-medium text-sm">
                Existing Medical Conditions <span className="text-gray-400">(optional)</span>
              </label>
              <input
                type="text"
                value={existingConditions}
                onChange={(e) => setExistingConditions(e.target.value)}
                placeholder="e.g. Diabetes, Hypertension"
                className="w-full border px-4 py-2 rounded-lg mt-1 focus:outline-none focus:border-teal-500"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg hover:bg-gray-50 transition"
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg font-medium transition disabled:opacity-50"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  )
}