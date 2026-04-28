import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

export default function Profile() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user") || "{}")
  const token = localStorage.getItem("token")

  const [appointments, setAppointments] = useState([])
  const [reports, setReports] = useState([])
  const [prescriptions, setPrescriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [uploadingReport, setUploadingReport] = useState(false)
  const [uploadingPrescription, setUploadingPrescription] = useState(false)
  const [uploadError, setUploadError] = useState("")
  const [uploadSuccess, setUploadSuccess] = useState("")

  useEffect(() => {
    if (!token) { navigate("/login"); return }
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    setLoading(true)
    try {
      const [apptRes, reportRes, prescRes] = await Promise.all([
        axios.get("http://localhost:5000/api/appointments/my", { headers: { Authorization: "Bearer " + token } }),
        axios.get("http://localhost:5000/api/report/my-reports", { headers: { Authorization: "Bearer " + token } }),
        axios.get("http://localhost:5000/api/report/my-prescriptions", { headers: { Authorization: "Bearer " + token } }),
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

  const upcoming = appointments.filter((a) => a.status === "pending" || a.status === "confirmed")
  const completed = appointments.filter((a) => a.status === "completed" || a.status === "cancelled")

  const handleReportUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploadingReport(true)
    setUploadError("")
    setUploadSuccess("")
    try {
      const formData = new FormData()
      formData.append("report", file)
      await axios.post("http://localhost:5000/api/report/upload", formData, { headers: { Authorization: "Bearer " + token } })
      setUploadSuccess("Report uploaded successfully!")
      fetchAllData()
    } catch (err) {
      setUploadError("Upload failed. Please try again.")
    } finally {
      setUploadingReport(false)
    }
  }

  const handlePrescriptionUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploadingPrescription(true)
    setUploadError("")
    setUploadSuccess("")
    try {
      const formData = new FormData()
      formData.append("prescription", file)
      await axios.post("http://localhost:5000/api/report/upload-prescription", formData, { headers: { Authorization: "Bearer " + token } })
      setUploadSuccess("Prescription uploaded successfully!")
      fetchAllData()
    } catch (err) {
      setUploadError("Upload failed. Please try again.")
    } finally {
      setUploadingPrescription(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 text-lg">Loading your profile...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-4xl mx-auto">

        <div className="bg-white rounded-2xl shadow-md p-8 mb-6">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-3xl shrink-0">
              {user.name ? user.name.charAt(0).toUpperCase() : "P"}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
              <p className="text-gray-500 text-sm mt-1">{user.email}</p>
              <p className="text-gray-500 text-sm">{user.phone}</p>
              <div className="flex gap-2 flex-wrap mt-3">
                {user.bloodGroup && (
                  <span className="bg-red-100 text-red-600 text-xs px-3 py-1 rounded-full font-medium">
                    Blood: {user.bloodGroup}
                  </span>
                )}
                {user.age && (
                  <span className="bg-blue-100 text-blue-600 text-xs px-3 py-1 rounded-full font-medium">
                    Age: {user.age}
                  </span>
                )}
                {user.gender && (
                  <span className="bg-purple-100 text-purple-600 text-xs px-3 py-1 rounded-full font-medium">
                    {user.gender}
                  </span>
                )}
                {user.city && (
                  <span className="bg-teal-100 text-teal-600 text-xs px-3 py-1 rounded-full font-medium">
                    {user.city}
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-6 text-center">
              <div>
                <p className="text-2xl font-bold text-teal-600">{appointments.length}</p>
                <p className="text-gray-400 text-xs">Total Visits</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-teal-600">{reports.length}</p>
                <p className="text-gray-400 text-xs">Reports</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-teal-600">{prescriptions.length}</p>
                <p className="text-gray-400 text-xs">Prescriptions</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex bg-white rounded-xl shadow-sm border border-gray-100 p-1 mb-6 overflow-x-auto">
          {[
            { key: "overview",      label: "Overview" },
            { key: "upcoming",      label: "Upcoming (" + upcoming.length + ")" },
            { key: "completed",     label: "Completed (" + completed.length + ")" },
            { key: "reports",       label: "Reports (" + reports.length + ")" },
            { key: "prescriptions", label: "Prescriptions (" + prescriptions.length + ")" },
          ].map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition whitespace-nowrap ${activeTab === tab.key ? "bg-teal-600 text-white" : "text-gray-500 hover:text-teal-600"}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {uploadSuccess && (
          <div className="bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {uploadSuccess}
          </div>
        )}
        {uploadError && (
          <div className="bg-red-50 border border-red-300 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
            {uploadError}
          </div>
        )}

        {activeTab === "overview" && (
          <div className="bg-white rounded-2xl shadow-md p-8">
            <h2 className="text-lg font-bold text-gray-800 mb-6">Personal and Medical Details</h2>
            <div className="grid grid-cols-2 gap-6">
              <InfoRow label="Full Name" value={user.name} />
              <InfoRow label="Email" value={user.email} />
              <InfoRow label="Phone" value={user.phone} />
              <InfoRow label="Age" value={user.age} />
              <InfoRow label="Gender" value={user.gender} />
              <InfoRow label="Blood Group" value={user.bloodGroup} />
              <InfoRow label="City" value={user.city} />
              <InfoRow label="Pincode" value={user.pincode} />
              <div className="col-span-2"><InfoRow label="Address" value={user.address} /></div>
              {user.allergies && <div className="col-span-2"><InfoRow label="Known Allergies" value={user.allergies} /></div>}
              {user.existingConditions && <div className="col-span-2"><InfoRow label="Existing Conditions" value={user.existingConditions} /></div>}
            </div>
            {user.emergencyContact && (
              <div className="mt-6 bg-red-50 border border-red-100 rounded-xl p-4">
                <p className="text-red-600 font-semibold text-sm mb-3">Emergency Contact</p>
                <div className="grid grid-cols-2 gap-4">
                  <InfoRow label="Name" value={user.emergencyContact.name} />
                  <InfoRow label="Phone" value={user.emergencyContact.phone} />
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "upcoming" && (
          <div className="bg-white rounded-2xl shadow-md p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-800">Upcoming Appointments</h2>
              <button onClick={() => navigate("/appointment")}
                className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-teal-700 transition">
                + Book New
              </button>
            </div>
            {upcoming.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg mb-3">No upcoming appointments</p>
                <button onClick={() => navigate("/appointment")}
                  className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition text-sm">
                  Book an Appointment
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {upcoming.map((appt) => <AppointmentCard key={appt._id} appt={appt} />)}
              </div>
            )}
          </div>
        )}

        {activeTab === "completed" && (
          <div className="bg-white rounded-2xl shadow-md p-8">
            <h2 className="text-lg font-bold text-gray-800 mb-6">Completed Appointments</h2>
            {completed.length === 0 ? (
              <p className="text-gray-400 text-center py-12">No completed appointments yet</p>
            ) : (
              <div className="flex flex-col gap-4">
                {completed.map((appt) => <AppointmentCard key={appt._id} appt={appt} />)}
              </div>
            )}
          </div>
        )}

        {activeTab === "reports" && (
          <div className="bg-white rounded-2xl shadow-md p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-800">My Medical Reports</h2>
              <input type="file" id="reportUpload" accept=".pdf,.jpg,.jpeg,.png" onChange={handleReportUpload} className="hidden" />
              <label htmlFor="reportUpload"
                className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm cursor-pointer hover:bg-teal-700 transition">
                {uploadingReport ? "Uploading..." : "+ Upload Report"}
              </label>
            </div>
            {reports.length === 0 ? (
              <p className="text-gray-400 text-center py-12">No reports uploaded yet</p>
            ) : (
              <div className="flex flex-col gap-3">
                {reports.map((report, i) => <FileCard key={i} file={report} type="report" />)}
              </div>
            )}
          </div>
        )}

        {activeTab === "prescriptions" && (
          <div className="bg-white rounded-2xl shadow-md p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-800">My Prescriptions</h2>
              <input type="file" id="prescUpload" accept=".pdf,.jpg,.jpeg,.png" onChange={handlePrescriptionUpload} className="hidden" />
              <label htmlFor="prescUpload"
                className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm cursor-pointer hover:bg-teal-700 transition">
                {uploadingPrescription ? "Uploading..." : "+ Upload Prescription"}
              </label>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-sm text-blue-700 mb-5">
              Your prescriptions are shared with the doctor during video and telephonic consultations.
            </div>
            {prescriptions.length === 0 ? (
              <p className="text-gray-400 text-center py-12">No prescriptions uploaded yet</p>
            ) : (
              <div className="flex flex-col gap-3">
                {prescriptions.map((presc, i) => <FileCard key={i} file={presc} type="prescription" />)}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div>
      <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">{label}</p>
      <p className="text-gray-800 font-medium mt-1">{value || "�"}</p>
    </div>
  )
}

function AppointmentCard({ appt }) {
  const statusColor = {
    pending:   "bg-yellow-100 text-yellow-700",
    confirmed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
    completed: "bg-gray-100 text-gray-600",
  }
  return (
    <div className="border border-gray-100 rounded-xl p-5 flex justify-between items-center hover:border-teal-200 transition">
      <div>
        <h3 className="font-semibold text-gray-800">{appt.doctorName || "Doctor"}</h3>
        <p className="text-gray-500 text-sm mt-1">{appt.speciality} � {appt.hospital}</p>
        <p className="text-gray-400 text-sm mt-1">
          {new Date(appt.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "long", year: "numeric" })} at {appt.time}
        </p>
      </div>
      <span className={"text-xs font-medium px-3 py-1 rounded-full " + (statusColor[appt.status] || "bg-gray-100 text-gray-600")}>
        {appt.status ? appt.status.charAt(0).toUpperCase() + appt.status.slice(1) : ""}
      </span>
    </div>
  )
}

function FileCard({ file, type }) {
  const whatsappText = "Prescription from Svasthya Connect: " + (file.fileUrl || "")
  const whatsappShare = "https://wa.me/?text=" + encodeURIComponent(whatsappText)
  return (
    <div className="border border-gray-100 rounded-xl p-4 flex justify-between items-center hover:border-teal-200 transition">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{type === "prescription" ? "??" : "??"}</span>
        <div>
          <p className="text-gray-800 font-medium text-sm">{file.fileName || "Document"}</p>
          <p className="text-gray-400 text-xs mt-1">
            Uploaded {new Date(file.uploadedAt).toLocaleDateString("en-IN")}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        {file.fileUrl && (
          <a href={file.fileUrl} target="_blank" rel="noreferrer"
            className="border border-teal-500 text-teal-600 px-3 py-1 rounded-lg text-xs hover:bg-teal-50 transition">
            View
          </a>
        )}
        {type === "prescription" && (
          <a href={whatsappShare} target="_blank" rel="noreferrer"
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-xs transition">
            Share on WhatsApp
          </a>
        )}
      </div>
    </div>
  )
}
