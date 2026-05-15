import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Mic, MicOff, MessageSquare, X, Send, Volume2, User, Bot, Globe, PhoneCall, Calendar, Pill, CheckCircle2, CreditCard, Clock, MapPin, Stethoscope, ShieldCheck, Ambulance, AlertTriangle } from "lucide-react";
import { isAuthenticated } from "../utils/auth";

const LANGUAGES = [
  { code: "en-IN", name: "English", welcome: "Hello! I am your Svasthya AI. How can I help you today?" },
  { code: "hi-IN", name: "हिन्दी", welcome: "नमस्ते! मैं आपकी स्वास्थ्य सहायक हूँ। मैं आपकी कैसे मदद कर सकती हूँ?" },
];

const TRANSLATIONS = {
  "en-IN": {
    askCity: "Which city are you in?",
    askSpec: "What kind of specialist do you need?",
    askAmbulance: "I found these ambulances near you. Which one should I dispatch?",
    dispatching: "Dispatching {type} Ambulance from {hospital} immediately. Help is on the way!",
    findingDoctors: "I found these top specialists in {city}:",
    askSlot: "Select a convenient time slot:",
    askPayment: "Please select a payment method to confirm booking:",
    success: "Booking Confirmed! Your appointment with {doctor} is scheduled.",
    emergencySuccess: "Ambulance Dispatched! A {type} unit is moving towards your location from {hospital}.",
    emergency: "Emergency detected. Please select your city for immediate dispatch.",
    pharmacy: "Opening the pharmacy for you.",
    error: "I didn't quite catch that. Try saying 'Book Appointment' or 'Emergency'.",
    cityNotFound: "City not recognized. Please pick from the list.",
    loginRequired: "Please login to your account to book an appointment."
  },
  "hi-IN": {
    askCity: "आप किस शहर में हैं?",
    askSpec: "आपको किस तरह के विशेषज्ञ की आवश्यकता है?",
    askAmbulance: "मुझे आपके पास ये एम्बुलेंस मिली हैं। किसे भेजना चाहिए?",
    dispatching: "{hospital} से {type} एम्बुलेंस तुरंत भेजी जा रही है। मदद रास्ते में है!",
    findingDoctors: "{city} में मुझे आपके लिए ये बेहतरीन विशेषज्ञ मिले हैं:",
    askSlot: "एक सुविधाजनक समय चुनें:",
    askPayment: "बुकिंग की पुष्टि के लिए भुगतान विधि चुनें:",
    success: "बुकिंग सफल! आपका अपॉइंटमेंट तय हो गया है।",
    emergencySuccess: "एम्बुलेंस भेज दी गई है! {hospital} से एक {type} यूनिट आपकी ओर आ रही है।",
    emergency: "आपातकाल का पता चला। तत्काल सहायता के लिए अपना शहर चुनें।",
    pharmacy: "आपके लिए फार्मेसी खोली जा रही है।",
    error: "मुझे समझ नहीं आया। 'अपॉइंटमेंट बुक करें' या 'आपातकालीन' कहें।",
    cityNotFound: "शहर की पहचान नहीं हुई। कृपया सूची से चुनें।",
    loginRequired: "अपॉइंटमेंट बुक करने के लिए कृपया अपने खाते में लॉगिन करें।"
  }
};

const CITIES = [
  { en: "Ranchi", hi: ["राँची", "रांची"] },
  { en: "Jamshedpur", hi: ["जमशेदपुर", "टाटा"] },
  { en: "Dhanbad", hi: ["धनबाद"] },
  { en: "Bokaro", hi: ["बोकारो"] },
  { en: "Hazaribagh", hi: ["हजारीबाग"] },
  { en: "Deoghar", hi: ["देवघर"] }
];

const SPECS = [
  { en: "Cardiologist", hi: ["हृदय", "दिल"] },
  { en: "Dentist", hi: ["दंत", "दांत"] },
  { en: "Neurologist", hi: ["दिमाग", "नसों"] },
  { en: "Gynecologist", hi: ["स्त्री रोग", "महिला"] },
  { en: "Pediatrician", hi: ["बच्चों", "शिशु"] }
];

const MOCK_DOCTORS = [
  { id: 1, name: "Dr. A. Sharma", hospital: "RIMS Hospital", fee: 500, city: "Ranchi" },
  { id: 2, name: "Dr. S. Verma", hospital: "Medanta Abdur Razzaque", fee: 800, city: "Ranchi" },
  { id: 3, name: "Dr. R. Gupta", hospital: "Apollo Clinics", fee: 600, city: "Ranchi" },
  { id: 4, name: "Dr. P. Jha", hospital: "Tata Main Hospital", fee: 700, city: "Jamshedpur" },
  { id: 5, name: "Dr. K. Singh", hospital: "Steel City Clinic", fee: 400, city: "Jamshedpur" },
];

const MOCK_AMBULANCES = [
  { id: 1, type: "Cardiac ALS", hospital: "RIMS Hospital", city: "Ranchi", time: "5 mins" },
  { id: 2, type: "Advanced Life Support", hospital: "Medanta", city: "Ranchi", time: "8 mins" },
  { id: 3, type: "Basic Life Support", hospital: "Sadar Hospital", city: "Ranchi", time: "12 mins" },
  { id: 4, type: "Cardiac Unit", hospital: "Tata Main Hospital", city: "Jamshedpur", time: "6 mins" },
  { id: 5, type: "Basic Unit", hospital: "Mercy Hospital", city: "Jamshedpur", time: "10 mins" },
  { id: 6, type: "Cardiac ALS", hospital: "Central Hospital", city: "Dhanbad", time: "7 mins" },
  { id: 7, type: "Basic Unit", hospital: "Patliputra Medical", city: "Dhanbad", time: "15 mins" },
  { id: 8, type: "Advanced Unit", hospital: "Bokaro General", city: "Bokaro", time: "9 mins" },
  { id: 9, type: "Basic Life Support", hospital: "KM Memorial", city: "Hazaribagh", time: "11 mins" },
  { id: 10, type: "Mobile ICU", hospital: "Satsang Hospital", city: "Deoghar", time: "5 mins" },
];

const SLOTS = ["10:00 AM", "02:30 PM", "05:00 PM"];
const PAY_METHODS = ["UPI (PhonePe/GPay)", "Credit/Debit Card", "Net Banking", "Pay at Hospital"];

export default function VoiceAssistant() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentLang, setCurrentLang] = useState(LANGUAGES[0]);
  const [step, setStep] = useState("IDLE");
  const [bookingData, setBookingData] = useState({ city: "", speciality: "", doctor: null, slot: "", payMethod: "" });
  const [emergencyData, setEmergencyData] = useState({ city: "", ambulance: null });
  const [messages, setMessages] = useState([{ sender: "bot", text: LANGUAGES[0].welcome }]);
  const [inputText, setInputText] = useState("");
  const [showLangs, setShowLangs] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const t = TRANSLATIONS[currentLang.code] || TRANSLATIONS["en-IN"];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = currentLang.code;
      recognitionRef.current = recognition;
    }
  }, [currentLang]);

  const speak = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      let voice = voices.find(v => v.lang === currentLang.code && (v.name.includes("Female") || v.name.includes("Kalpana")));
      if (!voice) voice = voices.find(v => v.lang.startsWith(currentLang.code.split('-')[0]));
      if (voice) utterance.voice = voice;
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.lang = currentLang.code;
      window.speechSynthesis.speak(utterance);
    }
  };

  const addBotMessage = (text) => {
    setMessages(prev => [...prev, { sender: "bot", text }]);
    speak(text);
  };

  const processIntent = useCallback((query) => {
    const lowerQuery = query.toLowerCase();

    // ── EMERGENCY FLOW ──────────────────────────────────────────────────────
    if (step === "EMERGENCY_CITY") {
      const foundCity = CITIES.find(c => lowerQuery.includes(c.en.toLowerCase()) || c.hi.some(h => lowerQuery.includes(h)));
      if (foundCity) {
        setEmergencyData(prev => ({ ...prev, city: foundCity.en }));
        setStep("SELECTING_AMBULANCE");
        addBotMessage(t.askAmbulance);
      } else addBotMessage(t.cityNotFound);
      return;
    }

    if (step === "SELECTING_AMBULANCE") {
      const filtered = MOCK_AMBULANCES.filter(a => a.city === emergencyData.city);
      const foundAmb = filtered.find(a => lowerQuery.includes(a.type.toLowerCase()) || lowerQuery.includes(a.id.toString()) || lowerQuery.includes(a.hospital.toLowerCase()));
      if (foundAmb) {
        setEmergencyData(prev => ({ ...prev, ambulance: foundAmb }));
        setStep("EMERGENCY_SUCCESS");
        const msg = t.dispatching.replace("{type}", foundAmb.type).replace("{hospital}", foundAmb.hospital);
        addBotMessage(msg);
      } else addBotMessage("Please select one of the nearest ambulances.");
      return;
    }

    // ── BOOKING FLOW ────────────────────────────────────────────────────────
    if (step === "BOOKING_CITY") {
      const foundCity = CITIES.find(c => lowerQuery.includes(c.en.toLowerCase()) || c.hi.some(h => lowerQuery.includes(h)));
      if (foundCity) {
        setBookingData(prev => ({ ...prev, city: foundCity.en }));
        setStep("BOOKING_SPEC");
        addBotMessage(t.askSpec);
      } else addBotMessage(t.cityNotFound);
      return;
    }

    if (step === "BOOKING_SPEC") {
      const foundSpec = SPECS.find(s => lowerQuery.includes(s.en.toLowerCase()) || s.hi.some(h => lowerQuery.includes(h)));
      if (foundSpec) {
        setBookingData(prev => ({ ...prev, speciality: foundSpec.en }));
        setStep("SELECTING_DOCTOR");
        addBotMessage(t.findingDoctors.replace("{city}", bookingData.city));
      } else addBotMessage(t.specNotFound);
      return;
    }

    if (step === "SELECTING_DOCTOR") {
      const filtered = MOCK_DOCTORS.filter(d => d.city === bookingData.city);
      const foundDoc = filtered.find(d => lowerQuery.includes(d.name.toLowerCase()) || lowerQuery.includes(d.id.toString()));
      if (foundDoc) {
        setBookingData(prev => ({ ...prev, doctor: foundDoc }));
        setStep("SELECTING_SLOT");
        addBotMessage(t.askSlot);
      } else addBotMessage("Please select a doctor.");
      return;
    }

    if (step === "SELECTING_SLOT") {
      const foundSlot = SLOTS.find(s => lowerQuery.includes(s.toLowerCase()));
      if (foundSlot) {
        setBookingData(prev => ({ ...prev, slot: foundSlot }));
        setStep("SELECTING_PAYMENT");
        addBotMessage(t.askPayment);
      } else addBotMessage("Please pick a slot.");
      return;
    }

    if (step === "SELECTING_PAYMENT") {
      if (lowerQuery.includes("upi") || lowerQuery.includes("card") || lowerQuery.includes("hospital") || lowerQuery.includes("पेमेंट") || lowerQuery.includes("हाँ")) {
        setStep("SUCCESS");
        const msg = t.success.replace("{doctor}", bookingData.doctor.name);
        addBotMessage(msg);
      } else addBotMessage("Please select a payment method.");
      return;
    }

    // ── GLOBAL COMMANDS ─────────────────────────────────────────────────────
    const isEmergency = lowerQuery.includes("ambulance") || lowerQuery.includes("emergency") || lowerQuery.includes("एम्बुलेंस") || lowerQuery.includes("इमरजेंसी");
    const isBooking = lowerQuery.includes("book") || lowerQuery.includes("appointment") || lowerQuery.includes("अपॉइंटमेंट") || lowerQuery.includes("बुक");

    if (isEmergency) {
      setStep("EMERGENCY_CITY");
      addBotMessage(t.emergency);
    } else if (isBooking) {
      if (!isAuthenticated()) {
        addBotMessage(t.loginRequired);
        return;
      }
      setStep("BOOKING_CITY");
      addBotMessage(t.askCity);
    } else {
      addBotMessage(t.error);
    }
  }, [navigate, currentLang, step, bookingData, emergencyData, t]);

  const handleUserMessage = useCallback((text) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { sender: "user", text: text.trim() }]);
    setInputText("");
    processIntent(text.trim());
  }, [processIntent]);

  useEffect(() => {
    const rec = recognitionRef.current;
    if (rec) {
      rec.onstart = () => setIsListening(true);
      rec.onerror = () => setIsListening(false);
      rec.onend = () => setIsListening(false);
      rec.onresult = (event) => handleUserMessage(event.results[0][0].transcript);
    }
  }, [handleUserMessage]);

  const toggleListen = () => {
    const rec = recognitionRef.current;
    if (!rec) return;
    if (isListening) rec.stop();
    else {
      if (!isOpen) setIsOpen(true);
      try { rec.start(); } catch (e) {}
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)} className="fixed bottom-6 right-6 w-16 h-16 bg-teal-600 rounded-full shadow-2xl flex items-center justify-center text-white z-[100] group hover:scale-110 transition-all">
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </button>

      {isOpen && (
        <div className="fixed bottom-28 right-6 w-80 sm:w-[420px] bg-white rounded-[32px] shadow-2xl border border-gray-100 overflow-hidden z-[100] flex flex-col h-[620px] max-h-[85vh] animate-slide-up">
          <div className="bg-teal-600 p-4 text-white flex justify-between items-center shrink-0">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"><Volume2 size={20} /></div>
                <div><h3 className="font-black text-base">Svasthya AI</h3><p className="text-[9px] font-bold text-teal-100 uppercase tracking-widest">{step.replace('_',' ')}</p></div>
             </div>
             <button onClick={() => setShowLangs(!showLangs)} className="p-2 hover:bg-white/10 rounded-lg border border-white/20 flex items-center gap-1"><Globe size={16} /><span className="text-[10px] font-bold uppercase">{currentLang.code.split('-')[0]}</span></button>
             {showLangs && <div className="absolute right-4 top-16 w-32 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden py-1 z-[110]">{LANGUAGES.map(l => <button key={l.code} onClick={() => { setCurrentLang(l); setMessages([{ sender: "bot", text: l.welcome }]); speak(l.welcome); setShowLangs(false); }} className={`w-full px-4 py-3 text-left text-xs font-bold hover:bg-gray-50 transition-colors ${currentLang.code === l.code ? 'text-teal-600' : 'text-gray-600'}`}>{l.name}</button>)}</div>}
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50/50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-gray-200 text-gray-600' : 'bg-teal-100 text-teal-600'}`}>{msg.sender === 'user' ? <User size={14} /> : <Bot size={14} />}</div>
                <div className={`p-4 rounded-2xl max-w-[85%] text-sm font-medium relative group/msg ${msg.sender === 'user' ? 'bg-gray-900 text-white rounded-tr-none' : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none shadow-sm'}`}>
                  {msg.text}
                  {msg.sender === 'bot' && <button onClick={() => speak(msg.text)} className="absolute -right-10 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white border border-gray-100 text-teal-600 opacity-0 group-hover/msg:opacity-100 transition-opacity hover:bg-teal-50"><Volume2 size={14} /></button>}
                </div>
              </div>
            ))}
            
            {/* INTERACTIVE ELEMENTS */}
            {(step === "BOOKING_CITY" || step === "EMERGENCY_CITY") && (
              <div className="flex flex-wrap gap-2 animate-slide-up">
                {CITIES.map(c => <button key={c.en} onClick={() => handleUserMessage(c.en)} className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-[10px] font-bold text-gray-700 hover:border-teal-500 transition-all shadow-sm flex items-center gap-1"><MapPin size={12} className={step === 'EMERGENCY_CITY' ? 'text-red-600' : 'text-teal-600'}/> {c.en}</button>)}
              </div>
            )}

            {step === "SELECTING_AMBULANCE" && (
              <div className="grid gap-3 animate-slide-up">
                {MOCK_AMBULANCES.filter(a => a.city === emergencyData.city).map(a => (
                  <button key={a.id} onClick={() => handleUserMessage(a.type)} className="flex items-center justify-between p-4 bg-white border border-red-100 rounded-2xl hover:border-red-500 hover:shadow-md transition-all group">
                    <div className="text-left"><p className="font-black text-gray-900 text-sm">{a.type}</p><p className="text-[10px] text-red-500 font-bold uppercase tracking-tighter">{a.hospital}</p></div>
                    <div className="text-right"><p className="text-gray-400 font-black text-[10px]">{a.time}</p><Ambulance size={18} className="text-gray-100 group-hover:text-red-500 ml-auto mt-1" /></div>
                  </button>
                ))}
              </div>
            )}

            {step === "BOOKING_SPEC" && (
              <div className="flex flex-wrap gap-2 animate-slide-up">
                {SPECS.map(s => <button key={s.en} onClick={() => handleUserMessage(s.en)} className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-[10px] font-bold text-gray-700 hover:border-teal-500 transition-all flex items-center gap-1"><Stethoscope size={12} className="text-purple-600"/> {s.en}</button>)}
              </div>
            )}

            {step === "SELECTING_DOCTOR" && (
              <div className="grid gap-3 animate-slide-up">
                {MOCK_DOCTORS.filter(d => d.city === bookingData.city).map(d => (
                  <button key={d.id} onClick={() => handleUserMessage(d.name)} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-2xl hover:border-teal-500 transition-all group">
                    <div className="text-left"><p className="font-black text-gray-900 text-sm">{d.name}</p><p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{d.hospital}</p></div>
                    <div className="text-right"><p className="text-teal-600 font-black text-xs">₹{d.fee}</p><CheckCircle2 size={16} className="text-gray-100 group-hover:text-teal-500 ml-auto mt-1" /></div>
                  </button>
                ))}
              </div>
            )}

            {step === "SELECTING_SLOT" && (
              <div className="flex flex-wrap gap-2 animate-slide-up">
                {SLOTS.map(s => <button key={s} onClick={() => handleUserMessage(s)} className="flex items-center gap-2 px-4 py-2 bg-teal-50 text-teal-700 border border-teal-100 rounded-xl text-xs font-bold hover:bg-teal-100 transition-all"><Clock size={14} /> {s}</button>)}
              </div>
            )}

            {step === "SELECTING_PAYMENT" && (
              <div className="grid gap-2 animate-slide-up">
                {PAY_METHODS.map(m => <button key={m} onClick={() => handleUserMessage(m)} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-2xl hover:border-teal-500 transition-all group"><span className="text-xs font-bold text-gray-700">{m}</span><CreditCard size={16} className="text-gray-300 group-hover:text-teal-600" /></button>)}
              </div>
            )}

            {step === "SUCCESS" && (
              <div className="p-6 bg-teal-50 border-2 border-teal-100 rounded-[32px] text-center animate-slide-up space-y-3">
                 <div className="w-16 h-16 bg-teal-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-teal-200"><ShieldCheck size={32} /></div>
                 <h4 className="font-black text-teal-900 text-lg">Booking Confirmed!</h4>
                 <button onClick={() => { setStep("IDLE"); setMessages([{ sender: "bot", text: currentLang.welcome }]); }} className="w-full py-3 bg-teal-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-teal-700 transition-all">Back to Home</button>
              </div>
            )}

            {step === "EMERGENCY_SUCCESS" && (
              <div className="p-6 bg-red-50 border-2 border-red-100 rounded-[32px] text-center animate-slide-up space-y-3">
                 <div className="w-16 h-16 bg-red-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-red-200"><AlertTriangle size={32} /></div>
                 <h4 className="font-black text-red-900 text-lg">Help is on the way!</h4>
                 <p className="text-xs text-red-700 font-medium leading-relaxed">Dispatching <b>{emergencyData.ambulance?.type}</b> from <b>{emergencyData.ambulance?.hospital}</b>.</p>
                 <button onClick={() => { setStep("IDLE"); setMessages([{ sender: "bot", text: currentLang.welcome }]); }} className="w-full py-3 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all">Cancel Dispatch</button>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <div className="p-5 bg-white border-t border-gray-100 shrink-0">
            {step === 'IDLE' && (
              <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
                <button onClick={() => handleUserMessage("Book Appointment")} className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-50 text-teal-600 border border-teal-100 text-[10px] font-black uppercase tracking-tighter"><Calendar size={12} /> Book Doctor</button>
                <button onClick={() => handleUserMessage("Emergency")} className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 text-red-600 border border-red-100 text-[10px] font-black uppercase tracking-tighter"><PhoneCall size={12} /> Emergency SOS</button>
              </div>
            )}
            <div className="flex gap-2 mb-3">
              <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleUserMessage(inputText)} placeholder={isListening ? "Listening..." : "Type or speak..." } className="flex-1 bg-gray-50 border-2 border-gray-50 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-teal-500 transition-all" />
              <button onClick={() => handleUserMessage(inputText)} className="bg-gray-900 text-white w-12 h-12 rounded-xl flex items-center justify-center hover:bg-black transition-all shadow-lg active:scale-95"><Send size={18} /></button>
            </div>
            <button onClick={toggleListen} className={`w-full py-3 rounded-2xl flex items-center justify-center gap-3 font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-md ${isListening ? "bg-red-500 text-white animate-pulse" : "bg-teal-600 text-white hover:bg-teal-700 shadow-teal-100"}`}>{isListening ? <><MicOff size={18} /> Recording</> : <><Mic size={18} /> Tap to Speak</>}</button>
          </div>
        </div>
      )}
    </>
  );
}
