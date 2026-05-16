import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { 
  User, 
  Mail, 
  Smartphone, 
  MapPin, 
  Calendar, 
  Activity, 
  Droplets, 
  ShieldAlert, 
  Stethoscope, 
  PhoneCall, 
  Edit3, 
  Save, 
  X, 
  Upload, 
  FileText, 
  Share2, 
  ExternalLink,
  ChevronRight,
  Clock,
  History,
  CheckCircle2,
  Trash2
} from "lucide-react"

// ── File validation helper ──────────────────────────────────────────────────
const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png"]
const MAX_SIZE_BYTES = 5 * 1024 * 1024   // 5 MB

function validateFile(file) {
  if (!ALLOWED_TYPES.includes(file.type)) return "Only PDF, JPG, or PNG files are allowed"
  if (file.size > MAX_SIZE_BYTES) return "File size must be under 5 MB"
  return null
}

export default function Profile() {
  const navigate = useNavigate()
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem("user") || "{}"))
  const token = localStorage.getItem("token")

  const [appointments, setAppointments]   = useState([])
  const [reports, setReports]             = useState([])
  const [prescriptions, setPrescriptions] = useState([])
  const [loading, setLoading]             = useState(true)
  const [activeTab, setActiveTab]         = useState("overview")
  const [isEditing, setIsEditing]         = useState(false)
  const [editForm, setEditForm]           = useState({ ...userData })

  const [uploadingReport, setUploadingReport]             = useState(false)
  const [uploadingPrescription, setUploadingPrescription] = useState(false)
  const [uploadError, setUploadError]   = useState("")
  const [uploadSuccess, setUploadSuccess] = useState("")

  useEffect(() => {
    if (!token) { navigate("/login"); return }
    fetchAllData()
  }, [])

  // Initial data fetch for appointments and documents
  const fetchAllData = async () => {
    setLoading(true)
    try {
      const [apptRes, reportRes, prescRes] = await Promise.all([
        axios.get("http://localhost:5000/api/appointments/my",          { headers: { Authorization: "Bearer " + token } }),
        axios.get("http://localhost:5000/api/report/my-reports",        { headers: { Authorization: "Bearer " + token } }),
        axios.get("http://localhost:5000/api/report/my-prescriptions",  { headers: { Authorization: "Bearer " + token } }),
      ])
      setAppointments(apptRes.data)
      setReports(reportRes.data)
      setPrescriptions(prescRes.data)
    } catch (err) {
      console.error("Failed to fetch profile data", err)
    } finally {
      setLoading(false)
    }
  }

  const today = new Date().toISOString().split("T")[0];
  const upcoming = appointments.filter(a => {
    const isPast = a.date < today;
    return !isPast && (a.status === "pending" || a.status === "confirmed");
  });
  const completed = appointments.filter(a => {
    const isPast = a.date < today;
    return isPast || a.status === "completed" || a.status === "cancelled";
  });

  // Update user profile information
  const handleSaveProfile = async () => {
    try {
      const res = await axios.put("http://localhost:5000/api/users/update", editForm, {
        headers: { Authorization: `Bearer ${token}` }
      })
      // Update local storage and component state with new user data
      localStorage.setItem("user", JSON.stringify(res.data.user))
      setUserData(res.data.user)
      setIsEditing(false)
      setUploadSuccess("Profile updated successfully!")
      setTimeout(() => setUploadSuccess(""), 3000)
    } catch (err) {
      setUploadError("Failed to update profile.")
    }
  }

  // Upload a medical report PDF or Image
  const handleReportUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    e.target.value = ""
    const fileErr = validateFile(file)
    if (fileErr) { setUploadError(fileErr); return }

    setUploadingReport(true)
    try {
      const formData = new FormData()
      formData.append("report", file)
      await axios.post("http://localhost:5000/api/report/upload", formData, {
        headers: { Authorization: "Bearer " + token }
      })
      setUploadSuccess("Report uploaded!")
      fetchAllData() // Refresh list
    } catch (err) { setUploadError("Upload failed.") } 
    finally { setUploadingReport(false) }
  }

  const handlePrescriptionUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    e.target.value = ""
    const fileErr = validateFile(file)
    if (fileErr) { setUploadError(fileErr); return }

    setUploadingPrescription(true)
    try {
      const formData = new FormData()
      formData.append("prescription", file)
      await axios.post("http://localhost:5000/api/report/upload-prescription", formData, {
        headers: { Authorization: "Bearer " + token }
      })
      setUploadSuccess("Prescription uploaded!")
      fetchAllData()
    } catch (err) { setUploadError("Upload failed.") }
    finally { setUploadingPrescription(false) }
  }

  const [selectedFile, setSelectedFile] = useState(null)

  // Delete a specific medical document
  const handleDeleteFile = async (id) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return
    try {
      const token = localStorage.getItem("token")
      await axios.delete(`http://localhost:5000/api/report/${id}`, {
        headers: { Authorization: "Bearer " + token }
      })
      setUploadSuccess("Document deleted successfully")
      fetchAllData() // Refresh list
      setSelectedFile(null) // Close viewer if open
    } catch (err) {
      console.error("Delete failed", err)
      setUploadError("Failed to delete document.")
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
       <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50/30 py-12 px-6">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* HEADER SECTION */}
        <div className="bg-gray-900 rounded-[48px] p-10 text-white relative overflow-hidden shadow-2xl shadow-indigo-100">
           <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full"></div>
           <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div className="flex items-center gap-8">
                 <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[32px] flex items-center justify-center text-3xl font-black shadow-xl">
                    {userData.name?.charAt(0).toUpperCase()}
                 </div>
                 <div className="space-y-1">
                    <h1 className="text-3xl font-black tracking-tight">{userData.name}</h1>
                    <p className="text-indigo-300 font-bold text-xs uppercase tracking-[0.2em]">{userData.email}</p>
                    <div className="flex gap-4 pt-2">
                       <Stat mini label="Visits" value={appointments.length} />
                       <Stat mini label="Reports" value={reports.length} />
                       <Stat mini label="Docs" value={prescriptions.length} />
                    </div>
                 </div>
              </div>
              <button 
                onClick={() => { setIsEditing(!isEditing); setEditForm({ ...userData }); }}
                className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${
                  isEditing ? "bg-white text-gray-900" : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                 {isEditing ? <><X size={16} /> Cancel</> : <><Edit3 size={16} /> Edit Profile</>}
              </button>
           </div>
        </div>

        {/* MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
           
           {/* SIDEBAR TABS */}
           <div className="lg:col-span-3 space-y-3">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 mb-4">Medical Records</p>
              {[
                { key: "overview", icon: User, label: "Overview" },
                { key: "upcoming", icon: Clock, label: "Upcoming" },
                { key: "completed", icon: History, label: "History" },
                { key: "reports", icon: FileText, label: "Reports" },
                { key: "prescriptions", icon: Stethoscope, label: "Prescriptions" },
              ].map(t => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`w-full flex items-center gap-4 p-5 rounded-3xl font-black text-[10px] uppercase tracking-widest transition-all ${
                    activeTab === t.key 
                      ? "bg-gray-900 text-white shadow-xl shadow-gray-200" 
                      : "text-gray-400 hover:bg-white hover:text-gray-900"
                  }`}
                >
                  <t.icon size={18} /> {t.label}
                </button>
              ))}
           </div>

           {/* CONTENT AREA */}
           <div className="lg:col-span-9 space-y-8">
              
              {uploadSuccess && (
                <div className="bg-teal-50 border border-teal-100 text-teal-600 px-6 py-4 rounded-[24px] font-bold text-sm animate-in fade-in slide-in-from-top-4">
                   ✨ {uploadSuccess}
                </div>
              )}

              {/* OVERVIEW TAB */}
              {activeTab === "overview" && (
                <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-xl shadow-gray-50 space-y-12">
                   <div className="flex justify-between items-center">
                      <h2 className="text-xl font-black text-gray-900">Personal Information</h2>
                      {isEditing && (
                        <button onClick={handleSaveProfile} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2">
                           <Save size={16} /> Save Changes
                        </button>
                      )}
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                      <ProfileField 
                        icon={User} label="Full Name" value={userData.name} 
                        isEditing={isEditing} field="name" form={editForm} setForm={setEditForm} 
                      />
                      <ProfileField 
                        icon={Smartphone} label="Phone Number" value={userData.phone} 
                        isEditing={isEditing} field="phone" form={editForm} setForm={setEditForm} 
                      />
                      <ProfileField 
                        icon={Calendar} label="Age" value={userData.age} 
                        isEditing={isEditing} field="age" form={editForm} setForm={setEditForm} type="number" 
                      />
                      <ProfileField 
                        icon={Activity} label="Gender" value={userData.gender} 
                        isEditing={isEditing} field="gender" form={editForm} setForm={setEditForm} type="select" options={["Male", "Female", "Other"]} 
                      />
                      <ProfileField 
                        icon={Droplets} label="Blood Group" value={userData.bloodGroup} 
                        isEditing={isEditing} field="bloodGroup" form={editForm} setForm={setEditForm} type="select" options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]} 
                      />
                      <ProfileField 
                        icon={MapPin} label="City" value={userData.city} 
                        isEditing={isEditing} field="city" form={editForm} setForm={setEditForm} 
                      />
                      <div className="md:col-span-2">
                        <ProfileField 
                          icon={MapPin} label="Full Address" value={userData.address} 
                          isEditing={isEditing} field="address" form={editForm} setForm={setEditForm} isTextArea 
                        />
                      </div>
                   </div>

                   <div className="pt-12 border-t border-gray-50 space-y-10">
                      <h2 className="text-xl font-black text-gray-900">Medical History</h2>
                      <div className="grid grid-cols-1 gap-10">
                         <ProfileField 
                           icon={ShieldAlert} label="Known Allergies" value={userData.allergies} 
                           isEditing={isEditing} field="allergies" form={editForm} setForm={setEditForm} isTextArea placeholder="None reported" 
                         />
                         <ProfileField 
                           icon={Stethoscope} label="Existing Conditions" value={userData.existingConditions} 
                           isEditing={isEditing} field="existingConditions" form={editForm} setForm={setEditForm} isTextArea placeholder="None reported" 
                         />
                      </div>
                   </div>

                   {/* EMERGENCY CONTACT */}
                   <div className="pt-12 border-t border-gray-50 space-y-8">
                      <div className="bg-red-50/50 rounded-[32px] p-8 border border-red-100/50">
                         <div className="flex items-center gap-3 mb-6">
                            <PhoneCall size={18} className="text-red-500" />
                            <h3 className="text-[10px] font-black text-red-600 uppercase tracking-widest">Emergency Contact</h3>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <ProfileField 
                               icon={User} label="Contact Name" value={userData.emergencyContact?.name} 
                               isEditing={isEditing} field="emergencyContact.name" form={editForm} setForm={setEditForm} 
                            />
                            <ProfileField 
                               icon={Smartphone} label="Contact Phone" value={userData.emergencyContact?.phone} 
                               isEditing={isEditing} field="emergencyContact.phone" form={editForm} setForm={setEditForm} 
                            />
                         </div>
                      </div>
                   </div>
                </div>
              )}

              {/* APPOINTMENTS TABS */}
              {(activeTab === "upcoming" || activeTab === "completed") && (
                <div className="space-y-6">
                   <div className="flex justify-between items-center px-4">
                      <h2 className="text-xl font-black text-gray-900">
                        {activeTab === "upcoming" ? "Active Sessions" : "Past Consultations"}
                      </h2>
                      {activeTab === "upcoming" && (
                        <button onClick={() => navigate("/appointment")} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                           Book New <ChevronRight size={14} />
                        </button>
                      )}
                   </div>
                   <div className="grid grid-cols-1 gap-4">
                      {(activeTab === "upcoming" ? upcoming : completed).length === 0 ? (
                        <div className="bg-white rounded-[40px] p-20 text-center border-2 border-dashed border-gray-100">
                           <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">No records found</p>
                        </div>
                      ) : (
                        (activeTab === "upcoming" ? upcoming : completed).map(appt => (
                          <AppointmentCard key={appt._id} appt={appt} />
                        ))
                      )}
                   </div>
                </div>
              )}

              {/* DOCUMENTS TABS */}
              {(activeTab === "reports" || activeTab === "prescriptions") && (
                <div className="space-y-8">
                   <div className="bg-gray-900 rounded-[40px] p-10 text-white flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl shadow-indigo-100 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-[60px] rounded-full"></div>
                      <div className="space-y-2 relative z-10">
                         <h2 className="text-2xl font-black">Medical {activeTab === "reports" ? "Reports" : "Prescriptions"}</h2>
                         <p className="text-indigo-300 font-bold text-[10px] uppercase tracking-widest">Share or view your official records</p>
                      </div>
                      <div className="relative z-10">
                        <input
                          type="file"
                          id="fileUpload"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={activeTab === "reports" ? handleReportUpload : handlePrescriptionUpload}
                          className="hidden"
                        />
                        <label htmlFor="fileUpload" className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest cursor-pointer transition-all flex items-center gap-3 shadow-xl">
                          {activeTab === "reports" 
                             ? (uploadingReport ? "Uploading..." : <><Upload size={16} /> Add Report</>) 
                             : (uploadingPrescription ? "Uploading..." : <><Upload size={16} /> Add Prescription</>)
                          }
                        </label>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {(activeTab === "reports" ? reports : prescriptions).length === 0 ? (
                        <div className="md:col-span-2 bg-white rounded-[40px] p-20 text-center border-2 border-dashed border-gray-100">
                           <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">No documents uploaded</p>
                        </div>
                      ) : (
                        (activeTab === "reports" ? reports : prescriptions).map((file, i) => (
                          <FileCard 
                            key={i} 
                            file={file} 
                            type={activeTab === "reports" ? "report" : "prescription"} 
                            onSelect={() => setSelectedFile(file)} 
                            onDelete={handleDeleteFile}
                          />
                        ))
                      )}
                   </div>
                </div>
              )}

           </div>
        </div>
      </div>

      {/* DOCUMENT VIEWER MODAL */}
      {selectedFile && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/80 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-3xl rounded-[48px] shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300">
              <div className="p-10 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white">
                       <FileText size={20} />
                    </div>
                    <div>
                       <h3 className="font-black text-gray-900">{selectedFile.fileName}</h3>
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          {new Date(selectedFile.uploadedAt || selectedFile.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                       </p>
                    </div>
                 </div>
                 <button onClick={() => setSelectedFile(null)} className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-100 transition-all shadow-sm">
                    <X size={20} />
                 </button>
              </div>
              <div className="p-10 max-h-[70vh] overflow-y-auto custom-scrollbar bg-white">
                 <div className="space-y-10">
                    {/* AI ANALYSIS SECTION */}
                    {selectedFile.analysis && (
                      <div className="space-y-6">
                         <div className="flex items-center gap-2 text-indigo-600">
                            <Activity size={18} />
                            <span className="text-[10px] font-black uppercase tracking-widest">AI Analysis Summary</span>
                         </div>
                         <div className="text-gray-600 leading-relaxed font-medium whitespace-pre-wrap bg-gray-50 p-8 rounded-[32px] border border-gray-100">
                            {selectedFile.analysis}
                         </div>
                      </div>
                    )}

                    {/* FILE PREVIEW SECTION */}
                    {selectedFile.fileUrl && selectedFile.fileUrl !== "N/A" && selectedFile.fileUrl !== "AI Processed" ? (
                      <div className="space-y-6">
                         <div className="flex items-center gap-2 text-indigo-600">
                            <FileText size={18} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Original Document</span>
                         </div>
                         <div className="rounded-[32px] overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center min-h-[300px]">
                            {(() => {
                              const cleanPath = selectedFile.fileUrl.replace(/^.*[\\\/]uploads[\\\/]/, '').replace(/^uploads[\\\/]/, '').replace(/^\//, '')
                              const fullUrl = selectedFile.fileUrl.startsWith('http') ? selectedFile.fileUrl : `http://localhost:5000/uploads/${cleanPath}`.replace(/\\/g, '/')
                              
                              if (selectedFile.fileUrl.toLowerCase().endsWith('.pdf')) {
                                return <iframe src={fullUrl} className="w-full h-[600px]" title="PDF Preview" />
                              } else {
                                return <img src={fullUrl} alt="Report Preview" className="max-w-full h-auto shadow-2xl" />
                              }
                            })()}
                         </div>
                      </div>
                    ) : (
                      !selectedFile.analysis && (
                        <div className="py-20 text-center space-y-6">
                           <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                              <FileText size={32} />
                           </div>
                           <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">No preview available for this document</p>
                        </div>
                      )
                    )}
                 </div>
              </div>
              <div className="p-10 border-t border-gray-50 bg-gray-50/30 flex justify-between items-center">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Svasthya Connect Digital Records</p>
                 <button onClick={() => setSelectedFile(null)} className="px-8 py-3 rounded-xl bg-gray-900 text-white font-black text-[10px] uppercase tracking-widest">
                    Close Viewer
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  )
}

function ProfileField({ icon: Icon, label, value, isEditing, field, form, setForm, type="text", options=[], isTextArea, placeholder }) {
  const handleChange = (e) => {
    const keys = field.split('.')
    if (keys.length > 1) {
       setForm({
         ...form,
         [keys[0]]: { ...form[keys[0]], [keys[1]]: e.target.value }
       })
    } else {
       setForm({ ...form, [field]: e.target.value })
    }
  }

  const currentVal = field.split('.').reduce((o, i) => o?.[i], form) || ""

  return (
    <div className="space-y-3">
       <div className="flex items-center gap-2 text-gray-400">
          <Icon size={14} />
          <span className="text-[9px] font-black uppercase tracking-[0.2em]">{label}</span>
       </div>
       {isEditing ? (
         isTextArea ? (
            <textarea 
              value={currentVal} 
              onChange={handleChange}
              placeholder={placeholder}
              rows="3"
              className="w-full bg-gray-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white px-5 py-4 rounded-2xl font-bold text-sm transition-all"
            />
         ) : type === "select" ? (
            <select 
              value={currentVal} 
              onChange={handleChange}
              className="w-full bg-gray-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white px-5 py-4 rounded-2xl font-bold text-sm transition-all appearance-none cursor-pointer"
            >
               <option value="">Select {label}</option>
               {options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
         ) : (
            <input 
              type={type} 
              value={currentVal} 
              onChange={handleChange}
              className="w-full bg-gray-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white px-5 py-4 rounded-2xl font-bold text-sm transition-all"
            />
         )
       ) : (
         <p className="font-bold text-gray-900 text-sm pl-1">{value || "—"}</p>
       )}
    </div>
  )
}

function Stat({ label, value, mini }) {
  return (
    <div className={mini ? "text-left" : "text-center"}>
       <p className="text-xl font-black text-indigo-400">{value}</p>
       <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">{label}</p>
    </div>
  )
}

function AppointmentCard({ appt }) {
  const today = new Date().toISOString().split("T")[0];
  const isPast = appt.date < today;
  const displayStatus = isPast && appt.status !== 'cancelled' ? "completed" : appt.status;

  const statusColor = {
    pending:   "bg-orange-100 text-orange-600 border-orange-200",
    confirmed: "bg-indigo-100 text-indigo-600 border-indigo-200",
    cancelled: "bg-red-100 text-red-600 border-red-200",
    completed: "bg-teal-100 text-teal-600 border-teal-200",
  }

  return (
    <div className={`bg-white border-2 rounded-[32px] p-6 flex flex-col md:flex-row justify-between md:items-center gap-6 transition-all duration-500 group ${
      isPast ? "border-gray-50 opacity-80" : "border-gray-50 hover:border-indigo-600 hover:shadow-xl"
    }`}>
      <div className="flex gap-5">
        <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-gray-50 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
          <Droplets size={24} />
        </div>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h3 className="font-black text-lg text-gray-900">{appt.doctorName || "Specialist"}</h3>
            <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest border ${statusColor[displayStatus] || "bg-gray-100 text-gray-400 border-gray-200"}`}>
              {displayStatus}
            </span>
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            {appt.speciality} • {appt.hospital}
          </p>
          <p className="text-[10px] font-bold text-gray-400 mt-2">
            {new Date(appt.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} at {appt.time}
          </p>
        </div>
      </div>
      <button className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">
         Details <ChevronRight size={14} className="inline" />
      </button>
    </div>
  )
}

function FileCard({ file, type, onSelect, onDelete }) {
  const serverUrl = "http://localhost:5000/"
  const isViewable = file.fileUrl && file.fileUrl !== "N/A" && file.fileUrl !== "AI Processed"
  
  let fullUrl = "#"
  if (isViewable) {
    if (file.fileUrl.startsWith('http')) {
      fullUrl = file.fileUrl
    } else {
      // CLEAN FILENAME: Remove 'uploads/' or 'uploads\' if present
      const cleanPath = file.fileUrl.replace(/^.*[\\\/]uploads[\\\/]/, '').replace(/^uploads[\\\/]/, '').replace(/^\//, '')
      fullUrl = `${serverUrl}uploads/${cleanPath}`.replace(/\\/g, '/')
    }
  }

  const whatsappText  = "Prescription from Svasthya Connect: " + fullUrl
  const whatsappShare = "https://wa.me/?text=" + encodeURIComponent(whatsappText)

  return (
    <div className="bg-white border border-gray-100 rounded-[32px] p-6 flex justify-between items-center group hover:border-indigo-600 transition-all duration-500 shadow-sm hover:shadow-xl">
      <div className="flex items-center gap-4 cursor-pointer flex-1" onClick={onSelect}>
        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
          <FileText size={20} />
        </div>
        <div>
          <p className="text-gray-900 font-black text-sm">{file.fileName || "Document"}</p>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            {new Date(file.uploadedAt || file.createdAt).toLocaleDateString("en-IN")}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        {isViewable && (
          <a 
            href={fullUrl} 
            target="_blank" 
            rel="noreferrer" 
            className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
            title="View Document"
          >
            <ExternalLink size={18} />
          </a>
        )}
        {type === "prescription" && (
          <a 
            href={whatsappShare} 
            target="_blank" 
            rel="noreferrer" 
            className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:bg-green-50 hover:text-green-600 transition-all"
            title="Share on WhatsApp"
          >
            <Share2 size={18} />
          </a>
        )}
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(file._id); }}
          className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"
          title="Delete Document"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  )
}
