import { Link } from "react-router-dom"
import { useState, useEffect, useRef } from "react"

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
      track.style.transform = "translateX(-" + position + "px)"
      requestAnimationFrame(animate)
    }

    const animation = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animation)
  }, [])

  const doubled = [...reviews, ...reviews]

  return (
    <div className="bg-teal-700 py-10 overflow-hidden">
      <h2 className="text-white text-xl font-bold text-center mb-6">
        What Jharkhand Says About Us ?
      </h2>
      <div className="overflow-hidden">
        <div ref={trackRef} className="flex gap-5 w-max">
          {doubled.map((r, i) => (
            <div key={i} className="bg-white rounded-xl p-5 w-72 shrink-0 shadow-md">
              <div className="flex gap-1 mb-2">
                {"?".repeat(r.rating).split("").map((s, j) => (
                  <span key={j} className="text-yellow-400 text-sm">{s}</span>
                ))}
              </div>
              <p className="text-gray-600 text-sm italic mb-3">"{r.text}"</p>
              <p className="text-gray-800 font-semibold text-sm">{r.name}</p>
              <p className="text-teal-600 text-xs">{r.city}, Jharkhand</p>
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
              <div className="flex gap-3">
                <a href="https://facebook.com" target="_blank" rel="noreferrer"
                  className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm hover:bg-blue-700 transition">f</a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer"
                  className="w-9 h-9 bg-pink-500 rounded-full flex items-center justify-center text-white text-sm hover:bg-pink-600 transition">in</a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer"
                  className="w-9 h-9 bg-sky-500 rounded-full flex items-center justify-center text-white text-sm hover:bg-sky-600 transition">tw</a>
                <a href="https://wa.me/919709899466" target="_blank" rel="noreferrer"
                  className="w-9 h-9 bg-green-500 rounded-full flex items-center justify-center text-white text-sm hover:bg-green-600 transition">wa</a>
              </div>
            </div>

            {/* QUICK LINKS */}
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <div className="flex flex-col gap-2 text-sm">
                <Link to="/" className="hover:text-teal-400 transition">Home</Link>
                <Link to="/appointment" className="hover:text-teal-400 transition">Book Appointment</Link>
                <Link to="/video-consult" className="hover:text-teal-400 transition">Video Consult</Link>
                <Link to="/ai-recommend" className="hover:text-teal-400 transition">AI Health Assistant</Link>
                <Link to="/nearby" className="hover:text-teal-400 transition">Nearby Hospitals</Link>
                <Link to="/medicines" className="hover:text-teal-400 transition">Order Medicines</Link>
                <Link to="/ambulance" className="hover:text-teal-400 transition">Emergency Ambulance</Link>
              </div>
            </div>

            {/* CONTACT */}
            <div>
              <h3 className="text-white font-semibold mb-4">Contact Us</h3>
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex items-start gap-2">
                  <span></span>
                  <p>Mahulia, Galudih<br />Jamshedpur, Jharkhand</p>
                </div>
                <div className="flex items-center gap-2">
                  <span></span>
                  <a href="tel:9709899466" className="hover:text-teal-400 transition">
                    +91 9709899466
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span></span>
                  <a href="https://wa.me/919709899466" target="_blank" rel="noreferrer"
                    className="hover:text-teal-400 transition">
                    WhatsApp Us
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span></span>
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
                <div className="bg-teal-700 rounded-xl p-4 text-center">
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
                    className="bg-gray-800 border border-gray-700 px-3 py-2 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-teal-500"
                  />
                  <input
                    type="text"
                    value={reviewCity}
                    onChange={(e) => setReviewCity(e.target.value)}
                    placeholder="Your city"
                    required
                    className="bg-gray-800 border border-gray-700 px-3 py-2 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-teal-500"
                  />
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share your experience..."
                    required
                    rows={3}
                    className="bg-gray-800 border border-gray-700 px-3 py-2 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 resize-none"
                  />
                  <button type="submit"
                    className="bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg text-sm transition">
                    Submit Review
                  </button>
                </form>
              )}
            </div>

          </div>

          {/* BOTTOM BAR */}
          <div className="border-t border-gray-800 pt-6 flex justify-between items-center text-xs text-gray-500">
            <p>2024 Svasthya Connect. All rights reserved. Mahulia, Galudih, Jamshedpur, Jharkhand</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-teal-400 transition">Privacy Policy</a>
              <a href="#" className="hover:text-teal-400 transition">Terms of Service</a>
              <a href="#" className="hover:text-teal-400 transition">Disclaimer</a>
            </div>
          </div>

        </div>
      </footer>
    </>
  )
}
