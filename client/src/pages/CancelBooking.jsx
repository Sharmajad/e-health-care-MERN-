import { useState, useEffect } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import axios from "axios"
import { 
  XCircle, 
  AlertTriangle, 
  ArrowLeft, 
  ChevronRight, 
  MessageSquare, 
  CheckCircle2, 
  Calendar,
  Loader2
} from "lucide-react"

export default function CancelBooking() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [appointment, setAppointment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  // Form State
  const [reason, setReason] = useState("")
  const [comments, setComments] = useState("")
  const [rescheduleInterest, setRescheduleInterest] = useState(false)
  const [newDate, setNewDate] = useState("")
  const [newTime, setNewTime] = useState("")

  const REASONS = [
    "Scheduling conflict",
    "Health improvement",
    "Found another specialist",
    "Personal reasons",
    "Distance/Travel issues",
    "Other"
  ]

  const SLOTS = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"]
  const todayStr = () => new Date().toISOString().split("T")[0]

  useEffect(() => {
    const fetchAppt = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await axios.get("http://localhost:5000/api/appointments/my", {
          headers: { Authorization: `Bearer ${token}` }
        })
        const found = res.data.find(a => a._id === id)
        if (!found) throw new Error("Appointment not found")
        setAppointment(found)
        setNewDate(found.date)
        setNewTime(found.time)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchAppt()
  }, [id])

  const handleAction = async () => {
    if (rescheduleInterest && (!newDate || !newTime)) {
      alert("Please select a new date and time")
      return
    }
    if (!rescheduleInterest && !reason) {
      alert("Please select a reason for cancellation")
      return
    }

    setSubmitting(true)
    try {
      const token = localStorage.getItem("token")
      if (rescheduleInterest) {
        await axios.put(`http://localhost:5000/api/appointments/${id}/reschedule`, 
          { date: newDate, time: newTime },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      } else {
        await axios.put(`http://localhost:5000/api/appointments/${id}/cancel`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        })
      }
      setSuccess(true)
      setTimeout(() => navigate("/dashboard"), 3000)
    } catch (err) {
      setError(err.response?.data?.message || "Action failed")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
       <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  if (success) return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 animate-in fade-in zoom-in duration-500">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center border-4 border-white shadow-xl">
            <CheckCircle2 className="text-red-600 w-12 h-12" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">{rescheduleInterest ? "Rescheduled Successfully" : "Cancelled"}</h2>
          <p className="text-gray-500 font-medium">
            {rescheduleInterest 
              ? "Your appointment timing has been updated. Returning to dashboard..." 
              : "Your appointment has been successfully removed from active sessions."}
          </p>
        </div>
        <div className="p-6 bg-gray-50 rounded-[32px] text-left border border-gray-100">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Next Steps</p>
           <p className="text-xs text-gray-600 leading-relaxed">
             The refund (if applicable) will be processed within 5-7 business days. You can view this record in your "Past Consultations" section.
           </p>
        </div>
        <button onClick={() => navigate("/dashboard")} className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all">
          Back to Dashboard
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50/30 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-gray-900 font-black text-[10px] uppercase tracking-widest mb-12 transition-colors">
          <ArrowLeft size={16} /> Go Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 space-y-10">
            <div className="space-y-4">
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">Cancellation Request</h1>
              <p className="text-gray-500 font-medium">We're sorry to see you go. Please help us understand why you're cancelling.</p>
            </div>

            <div className="space-y-8">
              {/* RESCHEDULE OPT-IN (PRIMARY CHOICE) */}
              <div 
                className={`p-6 rounded-[32px] border-2 transition-all flex items-center justify-between group cursor-pointer ${
                  rescheduleInterest 
                    ? "bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm" 
                    : "bg-white border-gray-50 text-gray-500 hover:border-indigo-100"
                }`} 
                onClick={() => {
                  setRescheduleInterest(true);
                  setReason("");
                }}
              >
                 <div className="flex items-center gap-4">
                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${rescheduleInterest ? "bg-indigo-600 border-indigo-600" : "bg-white border-gray-200"}`}>
                       {rescheduleInterest && <CheckCircle2 size={14} className="text-white" />}
                    </div>
                    <div>
                       <p className="text-sm font-bold">I want to reschedule instead</p>
                       <p className="text-[10px] opacity-60 font-bold uppercase">Change date/time of this booking</p>
                    </div>
                 </div>
                 <Calendar className={`transition-colors ${rescheduleInterest ? "text-indigo-600" : "text-gray-200"}`} size={20} />
              </div>

              {/* RESCHEDULE OPTIONS */}
              {rescheduleInterest ? (
                <div className="space-y-8 animate-in slide-in-from-top-4 duration-500">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">New Date</label>
                    <div className="relative">
                       <input
                        type="date"
                        min={todayStr()}
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        className="w-full bg-white border-2 border-gray-50 px-8 py-5 rounded-[28px] font-black text-lg text-gray-800 focus:outline-none focus:border-indigo-600 transition-all shadow-sm cursor-pointer"
                      />
                      <Calendar className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-200 pointer-events-none" size={20} />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">New Time Slot</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {SLOTS.map(s => (
                        <button
                          key={s}
                          onClick={() => setNewTime(s)}
                          className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-tight border-2 transition-all ${
                            newTime === s 
                              ? "bg-indigo-600 text-white border-indigo-600 shadow-lg scale-[1.02]" 
                              : "bg-white border-gray-50 text-gray-400 hover:border-indigo-200 hover:text-indigo-600"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-8 border-t border-gray-100">
                    <button
                      onClick={handleAction}
                      disabled={submitting || !newDate || !newTime}
                      className="w-full py-6 rounded-[28px] font-black uppercase tracking-[0.2em] text-[10px] transition-all shadow-2xl flex items-center justify-center gap-3 bg-indigo-600 text-white shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {submitting ? <Loader2 className="animate-spin" /> : <Calendar size={18} />}
                      {submitting ? "Processing..." : "Confirm Reschedule"}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-4 px-4">
                     <div className="h-[1px] flex-1 bg-gray-100"></div>
                     <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Or Provide Reason</span>
                     <div className="h-[1px] flex-1 bg-gray-100"></div>
                  </div>

                  {/* REASON SELECTION */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-3">
                      {REASONS.map(r => (
                        <button
                          key={r}
                          onClick={() => setReason(r)}
                          className={`flex items-center justify-between p-5 rounded-[24px] border-2 transition-all text-left group ${
                            reason === r 
                              ? "bg-red-50 border-red-200 text-red-600 shadow-sm" 
                              : "bg-white border-gray-50 text-gray-500 hover:border-red-100"
                          }`}
                        >
                          <span className="text-sm font-bold">{r}</span>
                          {reason === r && <CheckCircle2 size={18} />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* COMMENTS */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Additional Feedback (Optional)</label>
                    <div className="relative">
                      <textarea
                        rows="4"
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        placeholder="Tell us more about your experience..."
                        className="w-full bg-white border-2 border-gray-50 p-6 rounded-[32px] font-medium text-sm focus:outline-none focus:border-red-400 transition-all shadow-sm"
                      ></textarea>
                      <MessageSquare className="absolute right-6 bottom-6 text-gray-200" size={20} />
                    </div>
                  </div>

                  <div className="pt-8 border-t border-gray-100">
                    <button
                      onClick={handleAction}
                      disabled={submitting || !reason}
                      className="w-full py-6 rounded-[28px] font-black uppercase tracking-[0.2em] text-[10px] transition-all shadow-2xl flex items-center justify-center gap-3 bg-red-600 text-white shadow-red-100 hover:bg-red-700 disabled:opacity-50"
                    >
                      {submitting ? <Loader2 className="animate-spin" /> : <XCircle size={18} />}
                      {submitting ? "Processing..." : "Confirm Cancellation"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="sticky top-12 bg-gray-900 rounded-[40px] p-8 text-white space-y-8 relative overflow-hidden shadow-2xl shadow-gray-200">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-[50px] rounded-full"></div>
              
              <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Summary</h3>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-red-400">
                    <AlertTriangle size={24} />
                  </div>
                  <div>
                    <p className="font-black text-lg">{appointment?.doctorName}</p>
                    <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">{appointment?.speciality}</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Date</span>
                    <span className="text-xs font-bold">{appointment?.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Time</span>
                    <span className="text-xs font-bold">{appointment?.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Fee paid</span>
                    <span className="text-xs font-bold text-red-400">₹{appointment?.fee}</span>
                  </div>
                </div>

                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <p className="text-[9px] font-bold text-white/40 leading-relaxed uppercase tracking-widest">
                    Cancellation within 24 hours of the appointment may incur a processing fee as per hospital policy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
