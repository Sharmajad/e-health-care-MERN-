import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { 
  Bot, 
  MessageSquare, 
  FileText, 
  Upload, 
  User, 
  MapPin, 
  ChevronRight, 
  Activity, 
  Stethoscope, 
  AlertCircle,
  Shield,
  ArrowLeft,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Info,
  Plus,
  HeartPulse,
  BookOpen,
  CheckCircle,
  AlertOctagon
} from "lucide-react"

const COMMON_SYMPTOMS = [
  "Headache", "Fever", "Cough", "Cold", "Body Pain", 
  "Chest Pain", "Stomach Ache", "Skin Rash", "Dizziness",
  "Fatigue", "Shortness of Breath", "Sore Throat"
]

export default function AIRecommend() {
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [recommendation, setRecommendation] = useState(null)
  const [view, setView] = useState("input") // 'input' or 'results'
  const [activeTab, setActiveTab] = useState("symptoms") // 'symptoms' or 'report'
  const [symptomText, setSymptomText] = useState("")
  const [reportFile, setReportFile] = useState(null)
  const [userLocation, setUserLocation] = useState({ lat: 23.3441, lng: 85.3096 }) // Default Ranchi

  useEffect(() => {
    // We removed the immediate redirect to show the "Login Required" message instead
    if (token && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        },
        (err) => console.log("Location access denied, using default.")
      )
    }
  }, [token, navigate])

  const handleAnalyzeSymptoms = async () => {
    if (!symptomText.trim()) return
    setLoading(true)
    setError(null)
    try {
      const res = await axios.post("http://localhost:5000/api/aiRecomend/analyze-symptoms", { 
        symptoms: symptomText,
        lat: userLocation.lat,
        lng: userLocation.lng
      }, {
        headers: { Authorization: "Bearer " + token }
      })
      setRecommendation(res.data)
      setView("results")
    } catch (err) {
      console.error("AI Analysis failed", err)
      setError("AI analysis failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleAnalyzeReport = async () => {
    if (!reportFile) return
    setLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append("lat", userLocation.lat)
      formData.append("lng", userLocation.lng)
      formData.append("report", reportFile)
      
      const res = await axios.post("http://localhost:5000/api/aiRecomend/analyze-report", formData, {
        headers: { 
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + token
        }
      })
      setRecommendation(res.data)
      setView("results")
    } catch (err) {
      console.error("Report Analysis failed", err)
      setError("Report analysis failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const addSymptomTag = (tag) => {
    if (symptomText.includes(tag)) return
    const newText = symptomText ? `${symptomText}, ${tag}` : tag
    setSymptomText(newText)
  }

  const getSeverityColor = (severity) => {
    const s = severity?.toLowerCase() || ""
    if (s === "low") return "bg-green-100 text-green-700 border-green-200"
    if (s === "medium") return "bg-orange-100 text-orange-700 border-orange-200"
    if (s === "high") return "bg-red-100 text-red-700 border-red-200"
    return "bg-gray-100 text-gray-700 border-gray-200"
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {!token ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 bg-white rounded-[40px] shadow-2xl shadow-blue-100 border border-blue-50 text-center space-y-8 animate-in zoom-in duration-500">
            <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shadow-inner relative">
               <Bot size={48} className="animate-bounce" />
               <div className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full border-4 border-white">
                 <Shield size={16} />
               </div>
            </div>
            <div className="space-y-4 max-w-md">
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">Login to Continue</h2>
              <p className="text-gray-500 font-medium leading-relaxed">
                To access our premium AI Health Recommendation tools and medical report analysis, please sign in to your account.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
              <button 
                onClick={() => navigate("/login", { state: { from: "/ai-recommend" } })}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
              >
                <User size={18} /> Login Now
              </button>
              <button 
                onClick={() => navigate("/")}
                className="flex-1 bg-white border-2 border-gray-100 hover:border-gray-200 text-gray-600 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2"
              >
                Go Home
              </button>
            </div>
            <div className="pt-8 flex items-center gap-8 border-t border-gray-50 w-full justify-center">
              <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[2px]">
                <Activity size={14} className="text-red-500" /> Real-time Analysis
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[2px]">
                <FileText size={14} className="text-blue-500" /> Report Parsing
              </div>
            </div>
          </div>
        ) : view === "input" ? (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">
                <Bot size={16} className="animate-pulse" /> AI Medical Assistant
              </div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                AI Health Recommendation
              </h1>
              <p className="text-gray-500 max-w-lg mx-auto font-medium">
                Get instant insights about your health symptoms or medical reports using advanced AI analysis.
              </p>
            </div>

            {/* TABS */}
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex gap-2">
              <button 
                onClick={() => setActiveTab("symptoms")}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${activeTab === "symptoms" ? "bg-gray-900 text-white shadow-lg" : "text-gray-500 hover:bg-gray-50"}`}
              >
                <MessageSquare size={18} /> Enter Symptoms
              </button>
              <button 
                onClick={() => setActiveTab("report")}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${activeTab === "report" ? "bg-gray-900 text-white shadow-lg" : "text-gray-500 hover:bg-gray-50"}`}
              >
                <FileText size={18} /> Upload Report
              </button>
            </div>

            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
              {activeTab === "symptoms" ? (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Common Symptoms</label>
                    <div className="flex flex-wrap gap-2">
                      {COMMON_SYMPTOMS.map(s => (
                        <button 
                          key={s}
                          onClick={() => addSymptomTag(s)}
                          className="px-4 py-2 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 rounded-full text-xs font-bold text-gray-500 transition-all border border-gray-100 flex items-center gap-1 group"
                        >
                          <Plus size={12} className="group-hover:rotate-90 transition-transform" /> {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Describe your symptoms</label>
                    <textarea 
                      value={symptomText}
                      onChange={(e) => setSymptomText(e.target.value)}
                      placeholder="e.g. I have been having a persistent headache for 3 days and some dizziness..."
                      className="w-full min-h-[160px] bg-gray-50 border-2 border-gray-100 rounded-2xl p-6 text-gray-700 font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all resize-none"
                    />
                  </div>
                  <button 
                    onClick={handleAnalyzeSymptoms}
                    disabled={loading || !symptomText.trim()}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-blue-200 disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : <Activity size={20} />}
                    {loading ? "Analyzing Symptoms..." : "Analyze Symptoms"}
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Upload Medical Report (PDF/Image)</label>
                    <div className="relative group">
                      <input 
                        type="file" 
                        onChange={(e) => setReportFile(e.target.files[0])}
                        accept=".pdf,.jpg,.jpeg,.png,.txt"
                        className="hidden" 
                        id="report-input"
                      />
                      <label 
                        htmlFor="report-input"
                        className="w-full border-2 border-dashed border-gray-200 rounded-2xl p-12 flex flex-col items-center justify-center gap-4 cursor-pointer group-hover:border-blue-400 group-hover:bg-blue-50/30 transition-all"
                      >
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                          <Upload size={32} />
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-gray-700">{reportFile ? reportFile.name : "Click to select or drag and drop"}</p>
                          <p className="text-xs text-gray-400 font-medium mt-1">Supports PDF, JPG, PNG, TXT (Max 5MB)</p>
                        </div>
                      </label>
                    </div>
                  </div>
                  <button 
                    onClick={handleAnalyzeReport}
                    disabled={loading || !reportFile}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-blue-200 disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : <Activity size={20} />}
                    {loading ? "Processing Report..." : "Analyze Report"}
                  </button>
                </div>
              )}

              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm font-bold">
                  <AlertCircle size={18} /> {error}
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-8 pt-4">
              <div className="flex items-center gap-2 text-gray-400">
                <Shield size={16} /> <span className="text-[10px] font-black uppercase tracking-widest">Secure & Private</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin size={16} /> <span className="text-[10px] font-black uppercase tracking-widest">Localized Results</span>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-100 p-6 rounded-2xl flex gap-4">
              <AlertTriangle className="text-orange-500 shrink-0" size={24} />
              <p className="text-xs text-orange-700 font-medium leading-relaxed">
                <span className="font-black uppercase block mb-1">⚠️ AI-generated. Not a medical diagnosis.</span>
                Consult a real doctor for any medical concerns.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in slide-in-from-bottom-8 fade-in duration-700">
            {/* RESULTS VIEW */}
            <button 
              onClick={() => setView("input")}
              className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={14} /> Back to Analysis
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-8">
                {/* SUMMARY CARD */}
                <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl shadow-gray-200/30 overflow-hidden">
                  <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                    <div>
                      <h2 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">AI Health Insights</h2>
                      <h3 className="text-2xl font-black text-gray-900">Health Overview</h3>
                    </div>
                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center gap-2 ${getSeverityColor(recommendation?.severity)}`}>
                      <AlertOctagon size={14} /> Severity: {recommendation?.severity || "Unknown"}
                    </div>
                  </div>
                  
                  <div className="p-8 space-y-10">
                    {/* PROBLEM */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <HeartPulse size={16} className="text-red-500" /> 🩺 The Problem
                      </div>
                      <p className="text-xl font-bold text-gray-900 leading-relaxed">
                        {recommendation?.problem}
                      </p>
                    </div>

                    {/* WHAT IT MEANS */}
                    <div className="space-y-3 p-6 bg-blue-50/30 rounded-2xl border border-blue-50">
                      <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <BookOpen size={16} className="text-blue-500" /> 📖 What it means
                      </div>
                      <p className="text-gray-600 font-medium leading-relaxed">
                        {recommendation?.whatItMeans}
                      </p>
                    </div>

                    {/* WHAT TO DO */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <CheckCircle size={16} className="text-green-500" /> ✅ What to do
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {recommendation?.whatToDo?.map((step, idx) => (
                          <div key={idx} className="bg-white border border-gray-100 px-4 py-3 rounded-xl text-sm font-bold text-gray-700 flex items-center gap-3 shadow-sm">
                            <div className="w-5 h-5 bg-green-50 text-green-600 rounded-full flex items-center justify-center text-[10px] shrink-0">
                              {idx + 1}
                            </div>
                            {step}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* DOCTOR RECOMMENDATIONS */}
                <div className="space-y-6">
                  <h3 className="text-xl font-black text-gray-900 flex items-center gap-3 px-2">
                    <Stethoscope className="text-blue-600" /> Recommended {recommendation?.doctorType}s
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {recommendation?.doctors?.map((doc, i) => (
                      <div key={i} className="bg-white border border-gray-100 p-6 rounded-[24px] hover:border-blue-500 hover:shadow-xl transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 -mr-8 -mt-8 rounded-full"></div>
                        <div className="flex gap-4 items-start mb-4">
                          <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-xl shadow-sm border border-indigo-100">
                            {doc.name?.[0] || <User size={24} />}
                          </div>
                          <div>
                            <h4 className="font-black text-gray-900">{doc.name}</h4>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{doc.speciality}</p>
                            <p className="text-xs font-bold text-blue-600 mt-1 flex items-center gap-1">
                              <MapPin size={12} /> {doc.distance} km away
                            </p>
                          </div>
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">{doc.hospital}</p>
                        <button 
                          onClick={() => navigate("/appointment", { 
                            state: { 
                              fromAI: true,
                              doctor: doc,
                              doctorId: doc._id,
                              doctorName: doc.name,
                              city: doc.city,
                              hospital: doc.hospital
                            } 
                          })}
                          className="w-full py-3 bg-gray-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all"
                        >
                          Book Appointment
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* SIDEBAR */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-blue-600 rounded-[32px] p-8 text-white shadow-xl shadow-blue-200 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 -mr-16 -mt-16 rounded-full"></div>
                  <h4 className="text-xs font-black uppercase tracking-widest mb-6 opacity-70">Next Steps</h4>
                  <ul className="space-y-4">
                    {[
                      "Monitor symptoms daily",
                      "Keep reports organized",
                      "Book professional visit",
                      "Follow AI advice"
                    ].map((step, i) => (
                      <li key={i} className="flex gap-3 items-center font-bold text-sm">
                        <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                          <ChevronRight size={14} />
                        </div>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white border border-gray-100 rounded-[32px] p-8 space-y-6 sticky top-32">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Medical Disclaimer</h4>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed">
                    ⚠️ This analysis is AI-generated and for informational purposes only. It is NOT a medical diagnosis. Please consult a qualified doctor before making any medical decisions.
                  </p>
                  <button onClick={() => navigate("/appointment")} className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2">
                    <Stethoscope size={16} /> Book Real Doctor
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}