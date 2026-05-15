import { Link } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import { Star, ShieldCheck, Quote, Mail, Phone, MessageCircle, MapPin } from "lucide-react"

const reviews = [
  { name: "Anjali Sharma",   city: "Ranchi",      text: "Booked an appointment at RIMS in minutes. Amazing platform!",                          rating: 5 },
  { name: "Rohit Kumar",     city: "Jamshedpur",  text: "Video consult saved me a 2-hour trip to TMH. Very convenient.",                        rating: 5 },
  { name: "Priya Devi",      city: "Dhanbad",     text: "The AI report analysis explained my blood test in simple language. Very helpful.",      rating: 5 },
  { name: "Suresh Mahato",   city: "Bokaro",      text: "Found the nearest hospital instantly using the nearby feature. Excellent service.",     rating: 5 },
  { name: "Meena Kumari",    city: "Hazaribagh",  text: "Emergency ambulance number was right there. This app is a lifesaver.",                 rating: 5 },
  { name: "Vikash Singh",    city: "Deoghar",     text: "Ordered medicines from 1mg directly through the app. So convenient!",                  rating: 4 },
  { name: "Sunita Oraon",    city: "Ranchi",      text: "The chatbot helped me book my first appointment easily. Great for senior citizens.",    rating: 5 },
  { name: "Amit Verma",      city: "Jamshedpur",  text: "Best healthcare app for Jharkhand. Finally something built for us!",                   rating: 5 },
]

function MovingReviews() {
  const trackRef = useRef(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    let position = 0
    const speed = 0.5
    const totalWidth = track.scrollWidth / 2

    const animate = () => {
      position += speed
      if (position >= totalWidth) position = 0
      track.style.transform = `translateX(-${position}px)`
      requestAnimationFrame(animate)
    }

    const animation = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animation)
  }, [])

  const doubled = [...reviews, ...reviews]

  const renderStars = (count) => {
    return (
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={12} className={i < count ? "text-yellow-400 fill-current" : "text-gray-200 fill-current"} />
        ))}
      </div>
    )
  }

  return (
    <div className="bg-slate-900 py-16 overflow-hidden relative">
      <div className="max-w-6xl mx-auto px-6 mb-12 text-center relative z-10">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-full mb-4">
          <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Testimonials</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          What <span className="text-indigo-400">Jharkhand</span> Says About Us
        </h2>
      </div>

      <div className="overflow-hidden">
        <div ref={trackRef} className="flex gap-6 w-max px-6">
          {doubled.map((r, i) => (
            <div key={i} className="bg-white/95 backdrop-blur-sm rounded-[32px] p-8 w-[340px] shrink-0 shadow-2xl border border-white/20 transition-all hover:scale-[1.02] hover:bg-white duration-500 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote size={64} className="text-indigo-600" />
              </div>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-200">
                  {r.name[0]}
                </div>
                <div>
                  <h4 className="font-black text-gray-900 leading-tight">{r.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{r.city}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    {renderStars(r.rating)}
                  </div>
                </div>
              </div>

              <p className="text-gray-600 text-sm leading-relaxed font-medium italic relative z-10">
                "{r.text}"
              </p>

              <div className="mt-8 pt-6 border-t border-gray-50 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center">
                  <ShieldCheck size={12} className="text-green-600" />
                </div>
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Verified Patient</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Footer() {
  const [reviewName, setReviewName] = useState("")
  const [reviewText, setReviewText] = useState("")
  const [reviewCity, setReviewCity] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleReviewSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
    setReviewName("")
    setReviewText("")
    setReviewCity("")
  }

  return (
    <>
      <MovingReviews />

      <footer className="bg-gray-900 text-gray-300 pt-12 pb-6 px-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-4 gap-10 mb-10">

            {/* BRAND */}
            <div>
              <div className="flex items-center gap-3 mb-2">
  <img src="/logo.jpeg" alt="Svasthya Connect" className="h-10 w-10 rounded-full object-contain bg-white" />
  <h2 className="text-white text-xl font-bold">Svasthya Connect</h2>
</div>
              <p className="text-gray-400 text-sm mb-4">
                Jharkhand's trusted healthcare platform  connecting patients to doctors, hospitals and emergency services.
              </p>
              <div className="flex gap-4">
                {/* FACEBOOK */}
                <a href="https://facebook.com" target="_blank" rel="noreferrer"
                  className="w-10 h-10 bg-[#1877F2] rounded-full flex items-center justify-center text-white hover:scale-110 transition shadow-lg"
                  aria-label="Facebook">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>

                {/* INSTAGRAM */}
                <a href="https://instagram.com" target="_blank" rel="noreferrer"
                  className="w-10 h-10 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] rounded-full flex items-center justify-center text-white hover:scale-110 transition shadow-lg"
                  aria-label="Instagram">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>

                {/* TWITTER (X) */}
                <a href="https://twitter.com" target="_blank" rel="noreferrer"
                  className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white hover:scale-110 transition shadow-lg"
                  aria-label="Twitter">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>

                {/* WHATSAPP */}
                <a href="https://wa.me/919709899466" target="_blank" rel="noreferrer"
                  className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center text-white hover:scale-110 transition shadow-lg"
                  aria-label="WhatsApp">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* QUICK LINKS */}
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <div className="flex flex-col gap-2 text-sm">
                <Link to="/" className="hover:text-indigo-400 transition">Home</Link>
                <Link to="/appointment" className="hover:text-indigo-400 transition">Book Appointment</Link>
                <Link to="/video-consult" className="hover:text-indigo-400 transition">Video Consult</Link>
                <Link to="/ai-recommend" className="hover:text-indigo-400 transition">AI Health Assistant</Link>
                <Link to="/nearby" className="hover:text-indigo-400 transition">Nearby Hospitals</Link>
                <Link to="/medicines" className="hover:text-indigo-400 transition">Order Medicines</Link>
                <Link to="/ambulance" className="hover:text-indigo-400 transition">Emergency Ambulance</Link>
              </div>
            </div>

            {/* CONTACT */}
            <div>
              <h3 className="text-white font-semibold mb-4">Contact Us</h3>
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="text-indigo-400 mt-1" />
                  <p>Mahulia, Galudih<br />Jamshedpur, Jharkhand</p>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-indigo-400" />
                  <a href="tel:9709899466" className="hover:text-indigo-400 transition">
                    +91 9709899466
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle size={16} className="text-indigo-400" />
                  <a href="https://wa.me/919709899466" target="_blank" rel="noreferrer"
                    className="hover:text-indigo-400 transition">
                    WhatsApp: +91 9709899466
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-indigo-400" />
                  <a href="mailto:sharmajad@gmail.com" className="hover:text-indigo-400 transition">
                    sharmajad@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  <a href="tel:108" className="text-red-400 hover:text-red-300 transition font-semibold">
                    Emergency: 108
                  </a>
                </div>
              </div>
            </div>

            {/* WRITE A REVIEW */}
            <div>
              <h3 className="text-white font-semibold mb-4">Write a Review</h3>
              {submitted ? (
                <div className="bg-indigo-700 rounded-xl p-4 text-center">
                  <p className="text-white font-medium">? Thank you for your review!</p>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="flex flex-col gap-3">
                  <input
                    type="text"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    placeholder="Your name"
                    required
                    className="bg-gray-800 border border-gray-700 px-3 py-2 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                  />
                  <input
                    type="text"
                    value={reviewCity}
                    onChange={(e) => setReviewCity(e.target.value)}
                    placeholder="Your city"
                    required
                    className="bg-gray-800 border border-gray-700 px-3 py-2 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                  />
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share your experience..."
                    required
                    rows={3}
                    className="bg-gray-800 border border-gray-700 px-3 py-2 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none"
                  />
                  <button type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm transition">
                    Submit Review
                  </button>
                </form>
              )}
            </div>

          </div>

          {/* BOTTOM BAR */}
          <div className="border-t border-gray-800 pt-6 flex justify-between items-center text-xs text-gray-500">
            <p>2026 Svasthya Connect. All rights reserved. Mahulia, Galudih, Jamshedpur, Jharkhand</p>
            <div className="flex gap-4">
              <Link to="/privacy" className="hover:text-indigo-400 transition">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-indigo-400 transition">Terms of Service</Link>
              <Link to="/disclaimer" className="hover:text-indigo-400 transition">Disclaimer</Link>
            </div>
          </div>

        </div>
      </footer>
    </>
  )
}
