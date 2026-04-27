import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

export default function AIRecommend() {
  const navigate = useNavigate()

  // Tab state — which input mode is active
  const [activeTab, setActiveTab] = useState("symptoms") // "symptoms" or "report"

  // ── SYMPTOMS TAB STATE ─────────────────────────────────────────────────────
  const [symptoms, setSymptoms] = useState("")
  const [age, setAge] = useState("")
  const [gender, setGender] = useState("")
  const [city, setCity] = useState("")

  // ── REPORT TAB STATE ───────────────────────────────────────────────────────
  const [file, setFile] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [reportCity, setReportCity] = useState("")

  // ── SHARED RESULT STATE ────────────────────────────────────────────────────
  const [result, setResult] = useState(null)   // holds AI response
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const cities = [
    "Ranchi", "Jamshedpur", "Dhanbad", "Bokaro",
    "Hazaribagh", "Deoghar", "Giridih", "Dumka"
  ]

  const commonSymptoms = [
    "Chest pain", "Headache", "Fever", "Joint pain",
    "Skin rash", "Breathing difficulty", "Stomach pain",
    "Back pain", "Eye problem", "Ear pain"
  ]

  // ── SYMPTOM TAG CLICK ──────────────────────────────────────────────────────
  const addSymptom = (symptom) => {
    setSymptoms((prev) => prev ? `${prev}, ${symptom}` : symptom)
  }

  // ── FILE VALIDATION ────────────────────────────────────────────────────────
  const validateAndSetFile = (selected) => {
    setError("")
    setResult(null)
    const allowed = ["application/pdf", "image/jpeg", "image/png"]
    if (!allowed.includes(selected?.type)) {
      setError("Only PDF, JPG, or PNG files are allowed")
      return
    }
    if (selected.size > 5 * 1024 * 1024) {
      setError("File size must be under 5MB")
      return
    }
    setFile(selected)
  }

  const handleFileChange = (e) => validateAndSetFile(e.target.files[0])

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    validateAndSetFile(e.dataTransfer.files[0])
  }

  // ── RESET EVERYTHING ───────────────────────────────────────────────────────
  const handleReset = () => {
    setResult(null)
    setError("")
    setFile(null)
    setSymptoms("")
    setAge("")
    setGender("")
    setCity("")
    setReportCity("")
  }

  // ── SUBMIT SYMPTOMS ────────────────────────────────────────────────────────
  const handleSymptomsSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setResult(null)
    setLoading(true)

    try {
      const token = localStorage.getItem("token")

      const res = await axios.post(
        "http://localhost:5000/api/report/recommend",
        { symptoms, age, gender, city },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      setResult(res.data)

    } catch (err) {
      setError(err.response?.data?.message || "Could not get recommendations. Try again.")
    } finally {
      setLoading(false)
    }
  }

  // ── SUBMIT REPORT ──────────────────────────────────────────────────────────
  const handleReportSubmit = async () => {
    if (!file) { setError("Please select a file first"); return }
    if (!reportCity) { setError("Please select your city"); return }

    setError("")
    setResult(null)
    setLoading(true)

    try {
      const token = localStorage.getItem("token")

      // FormData because we are sending a binary file
      const formData = new FormData()
      formData.append("report", file)
      formData.append("city", reportCity)

      // Single endpoint handles both analysis AND recommendations
      const res = await axios.post(
        "http://localhost:5000/api/report/analyze-and-recommend",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      setResult(res.data)

    } catch (err) {
      setError(err.response?.data?.message || "Analysis failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // ── RESULT SCREEN — shown after either tab submits ─────────────────────────
  if (result) {
    return (
      <div className="min-h-screen bg-gray-50 py-10 px-6">
        <div className="max-w-2xl mx-auto">

          {/* HEADER */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">
              🤖 AI Analysis Complete
            </h1>
            <p className="text-gray-400 mt-2">
              Based on your {activeTab === "report" ? "medical report" : "symptoms"}
            </p>
          </div>

          {/* REPORT ANALYSIS SECTION — only shown when report was uploaded */}
          {result.analysis && (
            <div className="bg-white rounded-2xl shadow-md p-8 mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                📄 Report Analysis
              </h2>
              <div className="text-gray-600 leading-relaxed space-y-3">
                {result.analysis.split("\n").filter(Boolean).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
          )}

          {/* RECOMMENDED SPECIALISTS */}
          <div className="bg-white rounded-2xl shadow-md p-8 mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-2">
              👨‍⚕️ Recommended Specialists
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              Top doctors near you in Jharkhand
            </p>

            <div className="flex flex-col gap-4">
              {(result.specialists || []).map((spec, i) => (
                <div
                  key={i}
                  className="border border-gray-100 rounded-xl p-5 hover:border-teal-300 transition"
                >
                  <div className="flex justify-between items-start">
                    <div>

                      {/* First result gets Most Recommended badge */}
                      {i === 0 && (
                        <span className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded-full font-medium mb-2 inline-block">
                          ⭐ Most Recommended
                        </span>
                      )}

                      <h3 className="font-semibold text-gray-800 text-lg">
                        {spec.speciality}
                      </h3>
                      <p className="text-gray-500 text-sm mt-1">
                        {spec.reason}
                      </p>
                      <p className="text-teal-600 text-sm mt-2 font-medium">
                        📍 {spec.hospital}
                      </p>
                    </div>

                    <button
                      onClick={() => navigate("/appointment")}
                      className="border border-teal-600 text-teal-600 px-4 py-2 rounded-lg text-sm hover:bg-teal-50 transition ml-4 shrink-0"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI SUMMARY BOX */}
          {result.summary && (
            <div className="bg-blue-50 border border-blue-100 px-5 py-4 rounded-xl text-sm text-blue-800 leading-relaxed mb-6">
              <p className="font-semibold mb-1">🧠 AI Summary</p>
              <p>{result.summary}</p>
            </div>
          )}

          {/* DISCLAIMER */}
          <div className="bg-yellow-50 border border-yellow-200 px-4 py-3 rounded-xl text-sm text-yellow-700 mb-6">
            ⚠️ AI-generated for informational purposes only. Always consult
            a qualified doctor before any medical decision.
          </div>

          {/* TRY AGAIN */}
          <button
            onClick={handleReset}
            className="text-teal-600 text-sm hover:underline"
          >
            ← Try again
          </button>

        </div>
      </div>
    )
  }

  // ── INPUT SCREEN ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-2xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            🤖 AI Health Assistant
          </h1>
          <p className="text-gray-400 mt-2">
            Upload your report or describe your symptoms —
            get specialist recommendations across Jharkhand
          </p>
        </div>

        {/* TABS */}
        <div className="flex bg-white rounded-xl shadow-sm border border-gray-100 p-1 mb-6">
          <button
            onClick={() => { setActiveTab("symptoms"); setError("") }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === "symptoms"
                ? "bg-teal-600 text-white"
                : "text-gray-500 hover:text-teal-600"
            }`}
          >
            💬 Describe Symptoms
          </button>
          <button
            onClick={() => { setActiveTab("report"); setError("") }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === "report"
                ? "bg-teal-600 text-white"
                : "text-gray-500 hover:text-teal-600"
            }`}
          >
            📄 Upload Report
          </button>
        </div>

        {/* ── SYMPTOMS TAB ── */}
        {activeTab === "symptoms" && (
          <div className="bg-white rounded-2xl shadow-md p-8">
            <form onSubmit={handleSymptomsSubmit} className="flex flex-col gap-6">

              {/* Symptoms textarea */}
              <div>
                <label className="text-gray-700 font-medium text-sm">
                  Describe your symptoms
                </label>
                <textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="e.g. I have chest pain and shortness of breath for 3 days..."
                  required
                  rows={4}
                  className="w-full border px-4 py-2 rounded-lg mt-1 focus:outline-none focus:border-teal-500 text-gray-700 resize-none"
                />

                {/* Quick symptom tags */}
                <p className="text-gray-400 text-xs mt-2 mb-2">Quick add:</p>
                <div className="flex flex-wrap gap-2">
                  {commonSymptoms.map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => addSymptom(s)}
                      className="text-xs border border-teal-300 text-teal-600 px-3 py-1 rounded-full hover:bg-teal-50 transition"
                    >
                      + {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Age and Gender side by side */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-700 font-medium text-sm">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="e.g. 35"
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
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* City */}
              <div>
                <label className="text-gray-700 font-medium text-sm">
                  Your City in Jharkhand
                </label>
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

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-300 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-50"
              >
                {loading ? "🤖 Getting recommendations..." : "Get AI Recommendations"}
              </button>

            </form>
          </div>
        )}

        {/* ── REPORT TAB ── */}
        {activeTab === "report" && (
          <div className="bg-white rounded-2xl shadow-md p-8">
            <div className="flex flex-col gap-6">

              {/* Drag and drop zone */}
              <div
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                className={`border-2 border-dashed rounded-xl p-10 text-center transition ${
                  dragOver
                    ? "border-teal-500 bg-teal-50"
                    : "border-gray-300 hover:border-teal-400"
                }`}
              >
                <div className="text-5xl mb-3">📂</div>
                <p className="text-gray-600 font-medium mb-1">
                  Drag and drop your report here
                </p>
                <p className="text-gray-400 text-sm mb-4">
                  Blood test, X-ray, prescription — PDF, JPG, PNG · Max 5MB
                </p>
                <input
                  type="file"
                  id="fileInput"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="fileInput"
                  className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg cursor-pointer transition"
                >
                  Browse File
                </label>
              </div>

              {/* Selected file display */}
              {file && (
                <div className="flex items-center justify-between bg-teal-50 border border-teal-200 px-4 py-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-teal-600">📎</span>
                    <span className="text-gray-700 text-sm font-medium">{file.name}</span>
                    <span className="text-gray-400 text-xs">
                      ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                  <button
                    onClick={() => setFile(null)}
                    className="text-red-400 hover:text-red-600 text-sm"
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* City for report tab */}
              <div>
                <label className="text-gray-700 font-medium text-sm">
                  Your City in Jharkhand
                </label>
                <select
                  value={reportCity}
                  onChange={(e) => setReportCity(e.target.value)}
                  className="w-full border px-4 py-2 rounded-lg mt-1 focus:outline-none focus:border-teal-500 text-gray-700"
                >
                  <option value="">Select city</option>
                  {cities.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-300 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Analyze button */}
              <button
                onClick={handleReportSubmit}
                disabled={!file || loading}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-50"
              >
                {loading ? "🤖 Analyzing report..." : "Analyze Report & Get Recommendations"}
              </button>

            </div>
          </div>
        )}

      </div>
    </div>
  )
}