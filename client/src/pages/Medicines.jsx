import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Medicines() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")

  const platforms = [
    {
      name: "1mg",
      tagline: "India's most trusted medicine delivery",
      desc: "Order medicines, book lab tests, consult doctors online",
      color: "bg-red-50 border-red-200",
      btnColor: "bg-red-500 hover:bg-red-600",
      textColor: "text-red-600",
      icon: "💊",
      url: "https://www.1mg.com",
      searchUrl: "https://www.1mg.com/search/all?name=",
      features: ["Medicine delivery in 2hrs", "Lab tests at home", "Online doctor consult", "Genuine medicines"],
    },
    {
      name: "Netmeds",
      tagline: "India ki pharmacy",
      desc: "Prescription and OTC medicines delivered to your door",
      color: "bg-blue-50 border-blue-200",
      btnColor: "bg-blue-500 hover:bg-blue-600",
      textColor: "text-blue-600",
      icon: "🏥",
      url: "https://www.netmeds.com",
      searchUrl: "https://www.netmeds.com/catalogsearch/result?q=",
      features: ["Up to 25% discount", "PAN India delivery", "Licensed pharmacists", "Easy prescription upload"],
    },
    {
      name: "PharmEasy",
      tagline: "Making healthcare accessible",
      desc: "Order medicines and diagnostics with fast delivery",
      color: "bg-green-50 border-green-200",
      btnColor: "bg-green-600 hover:bg-green-700",
      textColor: "text-green-600",
      icon: "🩺",
      url: "https://pharmeasy.in",
      searchUrl: "https://pharmeasy.in/search/all?name=",
      features: ["Same day delivery", "Diagnostic tests", "Health packages", "24/7 pharmacist chat"],
    },
  ]

  const commonMedicines = [
    { name: "Paracetamol",  use: "Fever & Pain",        icon: "🌡️" },
    { name: "ORS Sachets",  use: "Dehydration",         icon: "💧" },
    { name: "Metformin",    use: "Diabetes",            icon: "🩸" },
    { name: "Amlodipine",   use: "Blood Pressure",      icon: "❤️" },
    { name: "Cetirizine",   use: "Allergy",             icon: "🤧" },
    { name: "Azithromycin", use: "Bacterial Infection", icon: "🦠" },
    { name: "Omeprazole",   use: "Acidity",             icon: "🔥" },
    { name: "Iron + Folic", use: "Anaemia",             icon: "💊" },
    { name: "Vitamin D3",   use: "Bone Health",         icon: "☀️" },
    { name: "Calcium",      use: "Bone Strength",       icon: "🦴" },
  ]

  const healthTips = [
    { tip: "Always show prescription before buying antibiotics",          icon: "📋" },
    { tip: "Check expiry date before purchasing any medicine",            icon: "📅" },
    { tip: "Store medicines away from direct sunlight and moisture",      icon: "☀️" },
    { tip: "Never share prescription medicines with others",              icon: "🚫" },
    { tip: "Complete the full antibiotic course even if you feel better", icon: "✅" },
  ]

  const handleSearch = () => {
    if (searchTerm.trim()) {
      window.open(
        "https://www.1mg.com/search/all?name=" + encodeURIComponent(searchTerm),
        "_blank"
      )
    }
  }

  const handleMedicineClick = (medicineName) => {
    window.open(
      "https://www.1mg.com/search/all?name=" + encodeURIComponent(medicineName),
      "_blank"
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">💊 Order Medicines Online</h1>
          <p className="text-gray-400 mt-2">
            Get medicines delivered to your home anywhere in Jharkhand
          </p>
        </div>

        {/* SEARCH BAR */}
        <div className="bg-white rounded-2xl shadow-md p-5 mb-8">
          <p className="text-gray-700 font-medium mb-3">🔍 Search medicine across all platforms</p>
          <div className="flex gap-3">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="e.g. Paracetamol, Metformin, Vitamin D..."
              className="flex-1 border px-4 py-2 rounded-lg focus:outline-none focus:border-teal-500 text-gray-700"
              onKeyDown={(e) => { if (e.key === "Enter") handleSearch() }}
            />
            <button
              onClick={handleSearch}
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg transition"
            >
              Search
            </button>
          </div>

          {/* Search on all platforms */}
          {searchTerm.trim() && (
            <div className="flex gap-3 mt-3 flex-wrap">
              <p className="text-gray-400 text-sm w-full">Search on:</p>
              {platforms.map((p) => (
                <a
                  key={p.name}
                  href={p.searchUrl + encodeURIComponent(searchTerm)}
                  target="_blank"
                  rel="noreferrer"
                  className={"text-xs px-4 py-1.5 rounded-full border font-medium transition " + p.color + " " + p.textColor}
                >
                  {p.icon} Search on {p.name}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* PLATFORM CARDS */}
        <h2 className="text-lg font-bold text-gray-800 mb-4">Choose a Platform</h2>
        <div className="grid grid-cols-3 gap-5 mb-10">
          {platforms.map((p) => (
            <div key={p.name} className={"rounded-2xl border p-6 flex flex-col " + p.color}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{p.icon}</span>
                <div>
                  <h3 className={"font-bold text-lg " + p.textColor}>{p.name}</h3>
                  <p className="text-gray-500 text-xs">{p.tagline}</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">{p.desc}</p>
              <ul className="flex flex-col gap-1 mb-5 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="text-gray-600 text-xs flex items-center gap-2">
                    <span className="text-green-500 font-bold">✓</span> {f}
                  </li>
                ))}
              </ul>
              <a
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className={"text-white py-2.5 rounded-xl text-sm font-medium text-center transition " + p.btnColor}
              >
                Visit {p.name} →
              </a>
            </div>
          ))}
        </div>

        {/* COMMON MEDICINES */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-2">🔖 Commonly Needed Medicines</h2>
          <p className="text-gray-400 text-sm mb-5">Click any medicine to search on 1mg</p>
          <div className="grid grid-cols-5 gap-3">
            {commonMedicines.map((m) => (
              <button
                key={m.name}
                onClick={() => handleMedicineClick(m.name)}
                className="bg-gray-50 hover:bg-teal-50 border border-gray-100 hover:border-teal-300 rounded-xl p-3 text-center transition"
              >
                <div className="text-2xl mb-1">{m.icon}</div>
                <p className="text-gray-800 text-xs font-medium">{m.name}</p>
                <p className="text-gray-400 text-xs mt-0.5">{m.use}</p>
              </button>
            ))}
          </div>
        </div>

        {/* PRESCRIPTION SECTION */}
        <div className="bg-teal-50 border border-teal-100 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <span className="text-4xl">📋</span>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-800 mb-1">Have a prescription?</h2>
              <p className="text-gray-500 text-sm mb-4">
                Upload your prescription to your profile — doctors can view it
                during consultations and you can share it on WhatsApp for medicine orders
              </p>
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => navigate("/profile")}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-lg text-sm transition"
                >
                  📤 Upload to Profile
                </button>
                <a
                  href="https://wa.me/"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg text-sm transition"
                >
                  📱 Share via WhatsApp
                </a>
                <button
                  onClick={() => navigate("/ai-recommend")}
                  className="border border-teal-500 text-teal-600 px-5 py-2 rounded-lg text-sm hover:bg-teal-50 transition"
                >
                  🤖 Analyse with AI
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* HEALTH TIPS */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-5">💡 Medicine Safety Tips</h2>
          <div className="flex flex-col gap-3">
            {healthTips.map((t, i) => (
              <div key={i} className="flex items-center gap-4 bg-gray-50 rounded-xl px-4 py-3">
                <span className="text-2xl">{t.icon}</span>
                <p className="text-gray-600 text-sm">{t.tip}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}