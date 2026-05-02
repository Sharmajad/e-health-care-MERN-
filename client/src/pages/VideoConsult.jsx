import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const API = "http://localhost:5000/api"

export default function VideoConsult() {
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [city, setCity] = useState("All")
  const [cities, setCities] = useState(["All"])
  const [doctors, setDoctors] = useState([])
  const [fetching, setFetching] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [problem, setProblem] = useState("")
  const [isEmergency, setIsEmergency] = useState(false)
  const [consultType, setConsultType] = useState("video")
  const [paymentDone, setPaymentDone] = useState(false)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [inCall, setInCall] = useState(false)
  const [callEnded, setCallEnded] = useState(false)

  useEffect(() => {
    axios.get(API + "/hospitals/cities")
      .then((res) => setCities(["All", ...res.data]))
      .catch(() => setCities(["All","Ranchi","Jamshedpur","Dhanbad","Bokaro","Hazaribagh","Deoghar","Giridih","Dumka"]))
  }, [])

  useEffect(() => {
    setFetching(true)
    const url = city === "All" ? API + "/doctors" : API + "/doctors?city=" + city
    axios.get(url)
      .then((res) => setDoctors(res.data))
      .catch(() => setDoctors([]))
      .finally(() => setFetching(false))
  }, [city])

  const handlePayment = async () => {
    setPaymentLoading(true)
    try {
      const token = localStorage.getItem("token")
      const user = JSON.parse(localStorage.getItem("user") || "{}")
      await axios.post(
        API + "/appointments",
        {
          patientName: user.name,
          city: selectedDoctor.city,
          hospital: selectedDoctor.hospital,
          speciality: selectedDoctor.speciality,
          doctorName: selectedDoctor.name,
          date: new Date().toISOString().split("T")[0],
          time: new Date().toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit" }),
          consultType, problem, isEmergency,
          fee: selectedDoctor.fee,
          status: "confirmed",
        },
        { headers: { Authorization: "Bearer " + token } }
      )
      setTimeout(() => { setPaymentDone(true); setPaymentLoading(false) }, 2000)
    } catch (err) {
      setPaymentLoading(false)
    }
  }

  if (inCall && selectedDoctor) {
    return <CallScreen doctor={selectedDoctor} onEnd={() => { setInCall(false); setCallEnded(true) }} />
  }

  if (callEnded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-md p-10 text-center max-w-md w-full">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Consultation Complete!</h2>
          <p className="text-gray-500 mb-6">Your consultation with {selectedDoctor.name} is done.</p>
          <div className="flex flex-col gap-3">
            <button onClick={() => navigate("/profile")} className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition">View in Profile</button>
            <button onClick={() => navigate("/medicines")} className="border border-teal-500 text-teal-600 px-6 py-2 rounded-lg hover:bg-teal-50 transition">Order Medicines</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">💻 Video Consultation</h1>
          <p className="text-gray-400 mt-2">Consult top Jharkhand doctors from home</p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-8">
          {["Choose Doctor","Your Problem","Payment","Start Call"].map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className={"w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold " + (step > i+1 ? "bg-green-500 text-white" : step === i+1 ? "bg-teal-600 text-white" : "bg-gray-200 text-gray-500")}>
                  {step > i+1 ? "✓" : i+1}
                </div>
                <span className={"text-xs font-medium hidden sm:block " + (step === i+1 ? "text-teal-600" : "text-gray-400")}>{label}</span>
              </div>
              {i < 3 && <div className={"h-0.5 w-6 " + (step > i+1 ? "bg-teal-500" : "bg-gray-200")} />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div>
            <div className="flex gap-2 flex-wrap mb-6">
              {cities.map((c) => (
                <button key={c} onClick={() => setCity(c)}
                  className={"px-4 py-1 rounded-full text-sm border transition " + (city === c ? "bg-teal-600 text-white border-teal-600" : "border-gray-300 text-gray-600 hover:border-teal-400")}>
                  {c}
                </button>
              ))}
            </div>

            {fetching ? <p className="text-center text-gray-400 py-10">Loading doctors...</p> : doctors.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <p>No doctors available</p>
                <button onClick={() => setCity("All")} className="mt-2 text-teal-600 text-sm hover:underline">Show all</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {doctors.map((doctor) => (
                  <div key={doctor._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:border-teal-300 transition">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-lg shrink-0">
                        {doctor.name.split(" ").map((n) => n[0]).join("").slice(0,2)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{doctor.name}</h3>
                        <p className="text-teal-600 text-sm">{doctor.speciality}</p>
                        <p className="text-gray-400 text-xs mt-1">{doctor.hospital} · {doctor.city}</p>
                        <p className="text-yellow-500 text-xs mt-1">★ {doctor.rating} · {doctor.experience} yrs exp</p>
                      </div>
                      <span className={"text-xs px-2 py-1 rounded-full font-medium shrink-0 " + (doctor.available ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500")}>
                        {doctor.available ? "Available" : "Busy"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                      <span className="text-gray-800 font-semibold">Rs.{doctor.fee} <span className="text-gray-400 font-normal text-sm">/ consult</span></span>
                      <button onClick={() => { setSelectedDoctor(doctor); setStep(2) }}
                        disabled={!doctor.available}
                        className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-40 disabled:cursor-not-allowed">
                        {doctor.available ? "Select" : "Unavailable"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-md p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-800">Step 2 — Describe Your Problem</h2>
              <button onClick={() => setStep(1)} className="text-teal-600 text-sm hover:underline">← Change Doctor</button>
            </div>
            <div className="bg-teal-50 rounded-xl p-4 mb-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold shrink-0">
                {selectedDoctor.name.split(" ").map((n) => n[0]).join("").slice(0,2)}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{selectedDoctor.name}</p>
                <p className="text-teal-600 text-sm">{selectedDoctor.speciality} · {selectedDoctor.hospital}</p>
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <div>
                <label className="text-gray-700 font-medium text-sm">Consultation Type</label>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  {[
                    { value: "video",    label: "💻 Video Call",  desc: "Face to face online" },
                    { value: "whatsapp", label: "📱 WhatsApp",    desc: "Voice on WhatsApp" },
                    { value: "inperson", label: "🏥 In-Person",   desc: "Visit hospital" },
                  ].map((t) => (
                    <button type="button" key={t.value} onClick={() => setConsultType(t.value)}
                      className={"border rounded-xl p-3 text-center transition " + (consultType === t.value ? "border-teal-500 bg-teal-50" : "border-gray-200 hover:border-teal-300")}>
                      <p className="font-medium text-sm text-gray-800">{t.label}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{t.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-gray-700 font-medium text-sm">Describe your problem</label>
                <textarea value={problem} onChange={(e) => setProblem(e.target.value)}
                  placeholder="e.g. I have been having chest pain for 2 days..."
                  rows={4} required
                  className="w-full border px-4 py-2 rounded-lg mt-1 focus:outline-none focus:border-teal-500 resize-none text-gray-700" />
              </div>
              <div>
                <label className="text-gray-700 font-medium text-sm mb-2 block">Is this an emergency?</label>
                <div className="flex gap-4">
                  <button type="button" onClick={() => setIsEmergency(false)}
                    className={"flex-1 py-3 rounded-xl border font-medium transition " + (!isEmergency ? "bg-teal-600 text-white border-teal-600" : "border-gray-200 text-gray-600 hover:border-teal-300")}>
                    No — Regular
                  </button>
                  <button type="button" onClick={() => setIsEmergency(true)}
                    className={"flex-1 py-3 rounded-xl border font-medium transition " + (isEmergency ? "bg-red-600 text-white border-red-600" : "border-gray-200 text-gray-600 hover:border-red-300")}>
                    🚨 Yes — Emergency
                  </button>
                </div>
                {isEmergency && (
                  <div className="mt-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                    For life-threatening emergencies please call <a href="tel:108" className="font-bold underline">108</a> immediately.
                  </div>
                )}
              </div>
              <button onClick={() => setStep(3)} disabled={!problem.trim()}
                className="bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-40">
                Continue to Payment →
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white rounded-2xl shadow-md p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-800">Step 3 — Payment</h2>
              <button onClick={() => setStep(2)} className="text-teal-600 text-sm hover:underline">← Back</button>
            </div>
            <div className="bg-gray-50 rounded-xl p-5 mb-6 text-sm flex flex-col gap-2">
              <h3 className="font-semibold text-gray-800 mb-1">Consultation Summary</h3>
              <div className="flex justify-between"><span className="text-gray-500">Doctor</span><span>{selectedDoctor.name}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Speciality</span><span>{selectedDoctor.speciality}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Hospital</span><span>{selectedDoctor.hospital}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Type</span><span>{consultType === "video" ? "Video Call" : consultType === "whatsapp" ? "WhatsApp" : "In-Person"}</span></div>
              <div className="flex justify-between border-t border-gray-200 pt-2 mt-1">
                <span className="font-semibold text-gray-800">Total Fee</span>
                <span className="font-bold text-teal-600 text-lg">Rs.{selectedDoctor.fee}</span>
              </div>
            </div>
            {!paymentDone ? (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "💳 Credit/Debit Card", desc: "Visa, Mastercard, Rupay" },
                    { label: "📱 UPI", desc: "GPay, PhonePe, Paytm" },
                    { label: "🏦 Net Banking", desc: "All major banks" },
                    { label: "💵 Pay at Hospital", desc: "Cash on arrival" },
                  ].map((m) => (
                    <div key={m.label} className="border border-gray-200 rounded-xl p-3 hover:border-teal-400 cursor-pointer transition">
                      <p className="font-medium text-gray-800 text-sm">{m.label}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{m.desc}</p>
                    </div>
                  ))}
                </div>
                <button onClick={handlePayment} disabled={paymentLoading}
                  className="bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-50">
                  {paymentLoading ? "Processing..." : "Pay Rs." + selectedDoctor.fee + " and Confirm"}
                </button>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-5xl mb-3">✅</div>
                <p className="text-green-600 font-semibold text-lg mb-2">Payment Successful!</p>
                <p className="text-gray-500 text-sm mb-6">Rs.{selectedDoctor.fee} paid</p>
                <button onClick={() => setStep(4)}
                  className="bg-teal-600 text-white px-8 py-3 rounded-lg hover:bg-teal-700 transition font-medium">
                  {consultType === "video" ? "Start Video Call →" : consultType === "whatsapp" ? "Open WhatsApp →" : "View Appointment →"}
                </button>
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="text-center py-10">
            {consultType === "video" && (
              <button onClick={() => setInCall(true)}
                className="bg-teal-600 text-white px-10 py-4 rounded-2xl text-lg font-bold hover:bg-teal-700 transition">
                🎥 Join Video Call with {selectedDoctor.name}
              </button>
            )}
            {consultType === "whatsapp" && (
              <a href={"https://wa.me/91" + selectedDoctor.phone + "?text=Hello " + selectedDoctor.name + ", I have booked a consultation. My problem: " + problem}
                target="_blank" rel="noreferrer"
                className="inline-block bg-green-500 text-white px-10 py-4 rounded-2xl text-lg font-bold hover:bg-green-600 transition">
                📱 Open WhatsApp with {selectedDoctor.name}
              </a>
            )}
            {consultType === "inperson" && (
              <div className="bg-white rounded-2xl shadow-md p-8 max-w-md mx-auto">
                <div className="text-5xl mb-4">🏥</div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Appointment Confirmed!</h2>
                <p className="text-gray-500 mb-4">Please visit {selectedDoctor.hospital} for your appointment.</p>
                <button onClick={() => navigate("/profile")} className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition">View in Profile</button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}

function CallScreen({ doctor, onEnd }) {
  const roomName = "SvasthyaConnect-" + doctor.name.replace(/\s+/g, "-")
  const jitsiUrl = "https://meet.jit.si/" + roomName
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <div className="bg-gray-800 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold text-sm">
            {doctor.name.split(" ").map((n) => n[0]).join("").slice(0,2)}
          </div>
          <div>
            <p className="text-white font-medium">{doctor.name}</p>
            <p className="text-gray-400 text-xs">{doctor.speciality} · {doctor.hospital}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          <span className="text-green-400 text-sm font-medium">Live</span>
        </div>
      </div>
      <iframe src={jitsiUrl} className="flex-1 w-full" allow="camera; microphone; fullscreen; display-capture" title="Video Consultation" />
      <div className="bg-gray-800 px-6 py-4 flex justify-center">
        <button onClick={onEnd} className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-medium transition">
          📵 End Call
        </button>
      </div>
    </div>
  )
}
