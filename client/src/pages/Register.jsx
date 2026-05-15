import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"

// ── Validation helpers ─────────────────────────────────────────────────────
const emailRegex  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phoneRegex  = /^\d{10}$/
const pincodeRegex = /^\d{6}$/

function validateStep1(name, email, phone, password, confirm) {
  const errs = {}

  if (!name.trim()) {
    errs.name = "Full name is required"
  } else if (name.trim().length < 2) {
    errs.name = "Name must be at least 2 characters"
  } else if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
    errs.name = "Name can only contain letters and spaces"
  }

  if (!email.trim()) {
    errs.email = "Email is required"
  } else if (!emailRegex.test(email.trim())) {
    errs.email = "Enter a valid email address"
  }

  if (!phone.trim()) {
    errs.phone = "Phone number is required"
  } else if (!phoneRegex.test(phone.trim())) {
    errs.phone = "Enter a valid 10-digit phone number"
  }

  if (!password) {
    errs.password = "Password is required"
  } else if (password.length < 6) {
    errs.password = "Password must be at least 6 characters"
  } else if (!/\d/.test(password)) {
    errs.password = "Password must contain at least one number"
  }

  if (!confirm) {
    errs.confirm = "Please confirm your password"
  } else if (password !== confirm) {
    errs.confirm = "Passwords do not match"
  }

  return errs
}

function validateStep2({ age, gender, bloodGroup, address, city, pincode, emergencyName, emergencyPhone }) {
  const errs = {}

  if (!age) {
    errs.age = "Age is required"
  } else if (Number(age) < 1 || Number(age) > 120) {
    errs.age = "Enter a valid age between 1 and 120"
  }

  if (!gender) errs.gender = "Please select a gender"

  if (!bloodGroup) errs.bloodGroup = "Please select a blood group"

  if (!address.trim()) {
    errs.address = "Address is required"
  } else if (address.trim().length < 10) {
    errs.address = "Address must be at least 10 characters"
  }

  if (!city) errs.city = "Please select a city"

  if (!pincode.trim()) {
    errs.pincode = "Pincode is required"
  } else if (!pincodeRegex.test(pincode.trim())) {
    errs.pincode = "Enter a valid 6-digit pincode"
  }

  if (!emergencyName.trim()) {
    errs.emergencyName = "Emergency contact name is required"
  } else if (emergencyName.trim().length < 2) {
    errs.emergencyName = "Name must be at least 2 characters"
  }

  if (!emergencyPhone.trim()) {
    errs.emergencyPhone = "Emergency contact phone is required"
  } else if (!phoneRegex.test(emergencyPhone.trim())) {
    errs.emergencyPhone = "Enter a valid 10-digit phone number"
  }

  return errs
}

export default function Register() {
  const navigate = useNavigate()

  // ── STEP STATE — multi-step form ──────────────────────────────────────────
  const [step, setStep] = useState(1)

  // ── STEP 1 FIELDS ─────────────────────────────────────────────────────────
  const [name, setName]       = useState("")
  const [email, setEmail]     = useState("")
  const [phone, setPhone]     = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [role, setRole]       = useState("patient")

  // ── STEP 2 FIELDS ─────────────────────────────────────────────────────────
  const [age, setAge]                       = useState("")
  const [gender, setGender]                 = useState("")
  const [bloodGroup, setBloodGroup]         = useState("")
  const [address, setAddress]               = useState("")
  const [city, setCity]                     = useState("")
  const [pincode, setPincode]               = useState("")
  const [emergencyName, setEmergencyName]   = useState("")
  const [emergencyPhone, setEmergencyPhone] = useState("")
  const [allergies, setAllergies]           = useState("")
  const [existingConditions, setExistingConditions] = useState("")

  // ── UI STATES ──────────────────────────────────────────────────────────────
  const [errors, setErrors]   = useState({})   // field-level
  const [error, setError]     = useState("")    // server error
  const [loading, setLoading] = useState(false)

  const cities     = ["Ranchi","Jamshedpur","Dhanbad","Bokaro","Hazaribagh","Deoghar","Giridih","Dumka"]
  const bloodGroups = ["A+","A-","B+","B-","AB+","AB-","O+","O-"]

  // Clear a single field error when user edits the field
  const clearErr = (field) =>
    setErrors((prev) => ({ ...prev, [field]: "" }))

  // ── STEP 1 HANDLER ────────────────────────────────────────────────────────
  const handleStep1 = (e) => {
    e.preventDefault()
    setError("")
    const errs = validateStep1(name, email, phone, password, confirm)
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    setErrors({})
    setStep(2)
  }

  // ── FINAL SUBMIT — runs on step 2 ─────────────────────────────────────────
  const handleRegister = async (e) => {
    e.preventDefault()
    setError("")
    const errs = validateStep2({ age, gender, bloodGroup, address, city, pincode, emergencyName, emergencyPhone })
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    setErrors({})
    setLoading(true)

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        // Step 1 data
        name, email, phone, password, role,
        // Step 2 data
        age, gender, bloodGroup, address, city, pincode,
        emergencyContact: { name: emergencyName, phone: emergencyPhone },
        allergies, existingConditions,
      })

      localStorage.setItem("token", res.data.token)
      localStorage.setItem("user", JSON.stringify(res.data.user))
      navigate("/dashboard")

    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // ── small reusable error text ──────────────────────────────────────────────
  const ErrMsg = ({ field }) =>
    errors[field] ? <p className="text-red-500 text-[10px] font-bold mt-1.5 ml-1">{errors[field]}</p> : null

  // ── border helper ──────────────────────────────────────────────────────────
  const inputCls = (field) =>
    `w-full bg-gray-50 border-2 px-5 py-3 rounded-2xl mt-1.5 text-sm font-medium transition-all focus:outline-none ${
      errors[field] ? "border-red-400 focus:border-red-400" : "border-transparent focus:border-teal-500/20 focus:bg-white"
    }`

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-6">
      <div className="bg-white p-10 rounded-[40px] shadow-2xl shadow-gray-200 border border-gray-100 w-full max-w-lg">

        {/* HEADER */}
        <div className="text-center mb-8">
           <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 mx-auto mb-4 border border-teal-100 shadow-sm">
             <h1 className="text-3xl">🩺</h1>
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Join Svasthya<span className="text-teal-600">Connect</span></h1>
          <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-1">Digital Health Network</p>
        </div>

        {/* ROLE SELECTOR */}
        <div className="flex bg-gray-50 p-1.5 rounded-2xl mb-8 border border-gray-100">
           {["patient", "doctor", "hospital"].map((r) => (
             <button
               key={r}
               type="button"
               disabled={step === 2}
               onClick={() => setRole(r)}
               className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                 role === r 
                   ? "bg-white text-teal-600 shadow-sm border border-gray-100 scale-100" 
                   : "text-gray-400 hover:text-gray-600 scale-95"
               } ${step === 2 ? 'opacity-50 cursor-not-allowed' : ''}`}
             >
               {r}
             </button>
           ))}
        </div>

        {/* STEP INDICATOR */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-black transition-all ${
            step >= 1 ? "bg-teal-600 text-white shadow-lg shadow-teal-100" : "bg-gray-100 text-gray-400"
          }`}>1</div>
          <div className={`h-1.5 w-12 rounded-full transition-all ${step >= 2 ? "bg-teal-600" : "bg-gray-100"}`} />
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-black transition-all ${
            step >= 2 ? "bg-teal-600 text-white shadow-lg shadow-teal-100" : "bg-gray-100 text-gray-400"
          }`}>2</div>
        </div>
        {/* SERVER ERROR */}
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-6 text-xs font-bold transition-all animate-in fade-in zoom-in">
            {error}
          </div>
        )}

        {/* ── STEP 1 — Account Details ── */}
        {step === 1 && (
          <form onSubmit={handleStep1} className="flex flex-col gap-5" noValidate>
            <p className="text-gray-500 text-sm font-medium">Step 1 of 2 — Account Details</p>

            {/* Full Name / Hospital Name / Doctor Name */}
            <div>
              <label className="text-gray-700 font-black text-[10px] uppercase tracking-widest ml-1">
                {role === "patient" ? "Full Name" : role === "doctor" ? "Doctor Name" : "Hospital Name"}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); clearErr("name") }}
                placeholder={role === "patient" ? "Rahul Kumar" : role === "doctor" ? "Dr. Rahul Kumar" : "City Hospital"}
                className={inputCls("name")}
              />
              <ErrMsg field="name" />
            </div>

            {/* Email */}
            <div>
              <label className="text-gray-700 font-black text-[10px] uppercase tracking-widest ml-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); clearErr("email") }}
                placeholder="you@example.com"
                className={inputCls("email")}
              />
              <ErrMsg field="email" />
            </div>

            {/* Phone */}
            <div>
              <label className="text-gray-700 font-medium text-sm">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => { setPhone(e.target.value); clearErr("phone") }}
                placeholder="9876543210"
                maxLength={10}
                className={inputCls("phone")}
              />
              <ErrMsg field="phone" />
            </div>

            {/* Password */}
            <div>
              <label className="text-gray-700 font-medium text-sm">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); clearErr("password") }}
                placeholder="Min 6 characters, include a number"
                className={inputCls("password")}
              />
              <ErrMsg field="password" />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-gray-700 font-medium text-sm">Confirm Password</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => { setConfirm(e.target.value); clearErr("confirm") }}
                placeholder="Re-enter your password"
                className={inputCls("confirm")}
              />
              <ErrMsg field="confirm" />
            </div>

            <button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-teal-100 active:scale-[0.98] mt-4"
            >
              Continue to Step 2 →
            </button>

            <p className="text-center text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-teal-600 hover:underline">
                Login here
              </Link>
            </p>
          </form>
        )}

        {/* ── STEP 2 — Medical Details ── */}
        {step === 2 && (
          <form onSubmit={handleRegister} className="flex flex-col gap-5" noValidate>
            <p className="text-gray-500 text-sm font-medium">Step 2 of 2 — Medical & Address Details</p>

            {/* Age and Gender */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-700 font-medium text-sm">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => { setAge(e.target.value); clearErr("age") }}
                  placeholder="e.g. 28"
                  min="1" max="120"
                  className={inputCls("age")}
                />
                <ErrMsg field="age" />
              </div>
              <div>
                <label className="text-gray-700 font-medium text-sm">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => { setGender(e.target.value); clearErr("gender") }}
                  className={inputCls("gender") + " text-gray-700"}
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <ErrMsg field="gender" />
              </div>
            </div>

            {/* Blood Group */}
            <div>
              <label className="text-gray-700 font-medium text-sm">Blood Group</label>
              <select
                value={bloodGroup}
                onChange={(e) => { setBloodGroup(e.target.value); clearErr("bloodGroup") }}
                className={inputCls("bloodGroup") + " text-gray-700"}
              >
                <option value="">Select blood group</option>
                {bloodGroups.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
              <ErrMsg field="bloodGroup" />
            </div>

            {/* Address */}
            <div>
              <label className="text-gray-700 font-medium text-sm">Full Address</label>
              <textarea
                value={address}
                onChange={(e) => { setAddress(e.target.value); clearErr("address") }}
                placeholder="House No., Street, Locality"
                rows={2}
                className={inputCls("address") + " resize-none"}
              />
              <ErrMsg field="address" />
            </div>

            {/* City and Pincode */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-700 font-medium text-sm">City</label>
                <select
                  value={city}
                  onChange={(e) => { setCity(e.target.value); clearErr("city") }}
                  className={inputCls("city") + " text-gray-700"}
                >
                  <option value="">Select city</option>
                  {cities.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ErrMsg field="city" />
              </div>
              <div>
                <label className="text-gray-700 font-medium text-sm">Pincode</label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => { setPincode(e.target.value); clearErr("pincode") }}
                  placeholder="834001"
                  maxLength={6}
                  className={inputCls("pincode")}
                />
                <ErrMsg field="pincode" />
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-red-50/50 border-2 border-red-50 rounded-[32px] p-6">
              <p className="text-red-600 font-black text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="animate-pulse">🆘</span> Emergency Contact
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-700 font-black text-[10px] uppercase tracking-widest ml-1">Contact Name</label>
                  <input
                    type="text"
                    value={emergencyName}
                    onChange={(e) => { setEmergencyName(e.target.value); clearErr("emergencyName") }}
                    placeholder="e.g. Sunita Devi"
                    className={inputCls("emergencyName")}
                  />
                  <ErrMsg field="emergencyName" />
                </div>
                <div>
                  <label className="text-gray-700 font-black text-[10px] uppercase tracking-widest ml-1">Contact Phone</label>
                  <input
                    type="tel"
                    value={emergencyPhone}
                    onChange={(e) => { setEmergencyPhone(e.target.value); clearErr("emergencyPhone") }}
                    placeholder="9876543210"
                    maxLength={10}
                    className={inputCls("emergencyPhone")}
                  />
                  <ErrMsg field="emergencyPhone" />
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
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button
                type="button"
                onClick={() => { setStep(1); setErrors({}) }}
                className="flex-1 border-2 border-gray-100 text-gray-400 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all active:scale-[0.98]"
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-teal-100 active:scale-[0.98]"
              >
                {loading ? "Creating account..." : "Complete Setup"}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  )
}