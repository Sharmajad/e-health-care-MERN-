import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()
import Hospital from "./src/models/Hospital.js"
import Doctor from "./src/models/Doctor.js"

const cityData = {
  Ranchi: {
    hospitals: [
      { name: "RIMS", address: "Bariatu Road, Ranchi", phone: "0651-2451070", ambulance: "0651-2451071", lat: 23.3561, lng: 85.3096, type: "Government", emergency: true },
      { name: "Medanta Hospital Ranchi", address: "Jail Road, Ranchi", phone: "0651-3520000", ambulance: "0651-3520001", lat: 23.3441, lng: 85.3096, type: "Private", emergency: true },
      { name: "AIIMS Ranchi", address: "Tupudana, Ranchi", phone: "0651-2451100", ambulance: "0651-2451101", lat: 23.3200, lng: 85.2800, type: "Government", emergency: true },
      { name: "CIP Kanke", address: "Kanke Road, Ranchi", phone: "0651-2451082", ambulance: "0651-2451082", lat: 23.3900, lng: 85.3200, type: "Government", emergency: false },
      { name: "Orchid Medical Centre", address: "Circular Road, Ranchi", phone: "0651-2331122", ambulance: "0651-2331123", lat: 23.3600, lng: 85.3300, type: "Private", emergency: true },
      { name: "Raj Hospital Ranchi", address: "Lalpur, Ranchi", phone: "0651-2345678", ambulance: "0651-2345679", lat: 23.3700, lng: 85.3150, type: "Private", emergency: true },
      { name: "Bokaro-Ranchi Mediway", address: "HEC Colony, Ranchi", phone: "0651-2567890", ambulance: "0651-2567891", lat: 23.3450, lng: 85.2950, type: "Private", emergency: false },
      { name: "Sadar Hospital Ranchi", address: "Upper Bazar, Ranchi", phone: "0651-2234567", ambulance: "0651-2234568", lat: 23.3650, lng: 85.3250, type: "Government", emergency: true },
    ],
  },
  Jamshedpur: {
    hospitals: [
      { name: "Tata Main Hospital (TMH)", address: "C Road, Bistupur, Jamshedpur", phone: "0657-2428570", ambulance: "0657-2428571", lat: 22.8046, lng: 86.2029, type: "Private", emergency: true },
      { name: "MGM Medical College Hospital", address: "Dimna Road, Mango, Jamshedpur", phone: "0657-2387100", ambulance: "0657-2387101", lat: 22.8200, lng: 86.2200, type: "Government", emergency: true },
      { name: "Brahmanand Narayana Hospital", address: "Adityapur, Jamshedpur", phone: "0657-6677777", ambulance: "0657-6677778", lat: 22.7800, lng: 86.1800, type: "Private", emergency: true },
      { name: "Mercy Hospital Jamshedpur", address: "Sakchi, Jamshedpur", phone: "0657-2221234", ambulance: "0657-2221235", lat: 22.8100, lng: 86.1900, type: "Private", emergency: true },
      { name: "Sadar Hospital Jamshedpur", address: "Baridih, Jamshedpur", phone: "0657-2334455", ambulance: "0657-2334456", lat: 22.8300, lng: 86.2100, type: "Government", emergency: true },
      { name: "Tata Motors Hospital", address: "Telco Colony, Jamshedpur", phone: "0657-2556677", ambulance: "0657-2556678", lat: 22.7900, lng: 86.1700, type: "Private", emergency: false },
      { name: "Apollo Clinic Jamshedpur", address: "Bistupur, Jamshedpur", phone: "0657-2998877", ambulance: "0657-2998878", lat: 22.8050, lng: 86.2150, type: "Private", emergency: false },
      { name: "XLRI Health Centre", address: "Circuit House Area, Jamshedpur", phone: "0657-3987654", ambulance: "0657-3987655", lat: 22.8150, lng: 86.2050, type: "Private", emergency: false },
    ],
  },
  Dhanbad: {
    hospitals: [
      { name: "SNMMCH Saraidhela", address: "Saraidhela, Dhanbad", phone: "0326-2310627", ambulance: "0326-2310628", lat: 23.7957, lng: 86.4304, type: "Government", emergency: true },
      { name: "PMCH Dhanbad", address: "Putki, Dhanbad", phone: "0326-2315151", ambulance: "0326-2315152", lat: 23.8000, lng: 86.4500, type: "Government", emergency: true },
      { name: "Apollo Clinic Dhanbad", address: "Bank More, Dhanbad", phone: "0326-2300100", ambulance: "0326-2300101", lat: 23.7900, lng: 86.4400, type: "Private", emergency: false },
      { name: "Sadar Hospital Dhanbad", address: "Hirapur, Dhanbad", phone: "0326-2223344", ambulance: "0326-2223345", lat: 23.8050, lng: 86.4350, type: "Government", emergency: true },
      { name: "Central Hospital BCCL", address: "Koyla Nagar, Dhanbad", phone: "0326-2334455", ambulance: "0326-2334456", lat: 23.7850, lng: 86.4250, type: "Private", emergency: true },
      { name: "Lifeline Hospital Dhanbad", address: "Jharia, Dhanbad", phone: "0326-2445566", ambulance: "0326-2445567", lat: 23.7750, lng: 86.4150, type: "Private", emergency: true },
      { name: "Medcare Hospital Dhanbad", address: "Govindpur, Dhanbad", phone: "0326-2556677", ambulance: "0326-2556678", lat: 23.8100, lng: 86.4450, type: "Private", emergency: false },
      { name: "ISM Health Centre Dhanbad", address: "ISM Campus, Dhanbad", phone: "0326-2345678", ambulance: "0326-2345679", lat: 23.8150, lng: 86.4300, type: "Government", emergency: false },
    ],
  },
  Bokaro: {
    hospitals: [
      { name: "Bokaro General Hospital", address: "Sector 4, Bokaro Steel City", phone: "06542-233100", ambulance: "06542-233101", lat: 23.6693, lng: 86.1511, type: "Government", emergency: true },
      { name: "SAIL Bokaro Steel Hospital", address: "Sector 1, Bokaro Steel City", phone: "06542-233200", ambulance: "06542-233201", lat: 23.6700, lng: 86.1600, type: "Private", emergency: true },
      { name: "Uma Super Speciality Hospital", address: "Chas, Bokaro", phone: "06542-234500", ambulance: "06542-234501", lat: 23.6800, lng: 86.1700, type: "Private", emergency: true },
      { name: "Sadar Hospital Bokaro", address: "Bokaro Town", phone: "06542-222334", ambulance: "06542-222335", lat: 23.6600, lng: 86.1400, type: "Government", emergency: true },
      { name: "City Hospital Bokaro", address: "Sector 6, Bokaro", phone: "06542-235600", ambulance: "06542-235601", lat: 23.6750, lng: 86.1550, type: "Private", emergency: false },
      { name: "Apollo Clinic Bokaro", address: "Sector 12, Bokaro", phone: "06542-236700", ambulance: "06542-236701", lat: 23.6650, lng: 86.1650, type: "Private", emergency: false },
      { name: "ESI Hospital Bokaro", address: "Sector 9, Bokaro", phone: "06542-237800", ambulance: "06542-237801", lat: 23.6850, lng: 86.1450, type: "Government", emergency: true },
      { name: "Bokaro Mission Hospital", address: "Chas Road, Bokaro", phone: "06542-238900", ambulance: "06542-238901", lat: 23.6900, lng: 86.1350, type: "Private", emergency: true },
    ],
  },
  Hazaribagh: {
    hospitals: [
      { name: "Sadar Hospital Hazaribagh", address: "GT Road, Hazaribagh", phone: "06546-222344", ambulance: "06546-222345", lat: 23.9925, lng: 85.3637, type: "Government", emergency: true },
      { name: "Hazaribagh Medical College", address: "Demotand, Hazaribagh", phone: "06546-224455", ambulance: "06546-224456", lat: 23.9800, lng: 85.3500, type: "Government", emergency: true },
      { name: "PHFI Hospital Hazaribagh", address: "Katkamsandi, Hazaribagh", phone: "06546-225566", ambulance: "06546-225567", lat: 23.9700, lng: 85.3400, type: "Private", emergency: true },
      { name: "Mission Hospital Hazaribagh", address: "Church Road, Hazaribagh", phone: "06546-226677", ambulance: "06546-226678", lat: 23.9850, lng: 85.3600, type: "Private", emergency: true },
      { name: "Medanta Hazaribagh", address: "Barhi Road, Hazaribagh", phone: "06546-227788", ambulance: "06546-227789", lat: 23.9950, lng: 85.3700, type: "Private", emergency: false },
      { name: "City Care Hospital Hazaribagh", address: "Argada, Hazaribagh", phone: "06546-228899", ambulance: "06546-228900", lat: 23.9600, lng: 85.3300, type: "Private", emergency: false },
      { name: "ESI Hospital Hazaribagh", address: "Near Bus Stand, Hazaribagh", phone: "06546-229900", ambulance: "06546-229901", lat: 24.0000, lng: 85.3650, type: "Government", emergency: true },
      { name: "Vinayak Hospital Hazaribagh", address: "Kokar, Hazaribagh", phone: "06546-230011", ambulance: "06546-230012", lat: 23.9750, lng: 85.3550, type: "Private", emergency: false },
    ],
  },
  Deoghar: {
    hospitals: [
      { name: "AIIMS Deoghar", address: "Devipur, Deoghar", phone: "06432-222100", ambulance: "06432-222101", lat: 24.4800, lng: 86.7000, type: "Government", emergency: true },
      { name: "Sadar Hospital Deoghar", address: "Tower Chowk, Deoghar", phone: "06432-222200", ambulance: "06432-222201", lat: 24.4850, lng: 86.7050, type: "Government", emergency: true },
      { name: "Shree Salasar Hospital", address: "Shivpur, Deoghar", phone: "06432-223300", ambulance: "06432-223301", lat: 24.4750, lng: 86.6950, type: "Private", emergency: true },
      { name: "Baidyanath Ayurveda Hospital", address: "Baidyanath Dham, Deoghar", phone: "06432-224400", ambulance: "06432-224401", lat: 24.4900, lng: 86.7100, type: "Private", emergency: false },
      { name: "Jeevan Jyoti Hospital Deoghar", address: "Mohanpur, Deoghar", phone: "06432-225500", ambulance: "06432-225501", lat: 24.4700, lng: 86.6900, type: "Private", emergency: true },
      { name: "Mission Hospital Deoghar", address: "Jasidih, Deoghar", phone: "06432-226600", ambulance: "06432-226601", lat: 24.5000, lng: 86.7200, type: "Private", emergency: true },
      { name: "Mata Pita Hospital Deoghar", address: "Rohini, Deoghar", phone: "06432-227700", ambulance: "06432-227701", lat: 24.4650, lng: 86.6850, type: "Private", emergency: false },
      { name: "Apollo Clinic Deoghar", address: "Station Road, Deoghar", phone: "06432-228800", ambulance: "06432-228801", lat: 24.4950, lng: 86.7150, type: "Private", emergency: false },
    ],
  },
  Giridih: {
    hospitals: [
      { name: "Sadar Hospital Giridih", address: "Main Road, Giridih", phone: "06532-222100", ambulance: "06532-222101", lat: 24.1900, lng: 86.3000, type: "Government", emergency: true },
      { name: "BSNL Hospital Giridih", address: "Bagodar Road, Giridih", phone: "06532-223200", ambulance: "06532-223201", lat: 24.1950, lng: 86.3050, type: "Government", emergency: true },
      { name: "City Hospital Giridih", address: "Station Road, Giridih", phone: "06532-224300", ambulance: "06532-224301", lat: 24.1850, lng: 86.2950, type: "Private", emergency: true },
      { name: "Lifeline Hospital Giridih", address: "Pirtand, Giridih", phone: "06532-225400", ambulance: "06532-225401", lat: 24.2000, lng: 86.3100, type: "Private", emergency: false },
      { name: "Shree Hospital Giridih", address: "Bengabad, Giridih", phone: "06532-226500", ambulance: "06532-226501", lat: 24.1800, lng: 86.2900, type: "Private", emergency: false },
      { name: "Prakash Hospital Giridih", address: "Tisri, Giridih", phone: "06532-227600", ambulance: "06532-227601", lat: 24.2050, lng: 86.3150, type: "Private", emergency: true },
      { name: "Jan Seva Hospital Giridih", address: "Dhanwar, Giridih", phone: "06532-228700", ambulance: "06532-228701", lat: 24.1750, lng: 86.2850, type: "Private", emergency: false },
      { name: "ESI Hospital Giridih", address: "Industrial Area, Giridih", phone: "06532-229800", ambulance: "06532-229801", lat: 24.2100, lng: 86.3200, type: "Government", emergency: true },
    ],
  },
  Dumka: {
    hospitals: [
      { name: "Phulo Jhano Medical College", address: "Dumka Road, Dumka", phone: "06434-222100", ambulance: "06434-222101", lat: 24.2700, lng: 87.2500, type: "Government", emergency: true },
      { name: "Sadar Hospital Dumka", address: "Station Road, Dumka", phone: "06434-223200", ambulance: "06434-223201", lat: 24.2750, lng: 87.2550, type: "Government", emergency: true },
      { name: "Sido Kanhu Hospital Dumka", address: "Masalia, Dumka", phone: "06434-224300", ambulance: "06434-224301", lat: 24.2650, lng: 87.2450, type: "Government", emergency: true },
      { name: "Santhal Pargana Hospital", address: "Rampurhat Road, Dumka", phone: "06434-225400", ambulance: "06434-225401", lat: 24.2800, lng: 87.2600, type: "Private", emergency: true },
      { name: "Apollo Clinic Dumka", address: "Dumka Bazar", phone: "06434-226500", ambulance: "06434-226501", lat: 24.2600, lng: 87.2400, type: "Private", emergency: false },
      { name: "Mission Hospital Dumka", address: "Shikaripara, Dumka", phone: "06434-227600", ambulance: "06434-227601", lat: 24.2850, lng: 87.2650, type: "Private", emergency: true },
      { name: "Arogya Hospital Dumka", address: "Jarmundi, Dumka", phone: "06434-228700", ambulance: "06434-228701", lat: 24.2550, lng: 87.2350, type: "Private", emergency: false },
      { name: "Tribal Health Centre Dumka", address: "Gopikandar, Dumka", phone: "06434-229800", ambulance: "06434-229801", lat: 24.2900, lng: 87.2700, type: "Government", emergency: true },
    ],
  },
}

const allDepartments = [
  "General Physician", "Cardiologist", "Neurologist", "Orthopedist",
  "Gynecologist", "Pediatrician", "Dermatologist", "Psychiatrist",
  "Oncologist", "Nephrologist", "Ophthalmologist", "ENT Specialist",
  "Gastroenterologist", "Pulmonologist", "Endocrinologist",
]

const departmentsByType = {
  Government: allDepartments,
  Private: ["General Physician","Cardiologist","Neurologist","Orthopedist","Gynecologist","Pediatrician","Dermatologist","Psychiatrist","Oncologist","Gastroenterologist"],
}

const firstNames = ["Priya","Amit","Sunita","Rakesh","Meera","Vijay","Anjali","Suresh","Deepak","Kavita","Manoj","Anil","Vikash","Suman","Rohit","Pooja","Ritu","Neha","Prem","Savita","Rahul","Sanjay","Anita","Prakash","Ravi","Smita","Ajay","Nisha","Dinesh","Rekha","Ashok","Usha","Mohan","Geeta","Ramesh","Sita","Arun","Manju","Vinod","Pushpa","Naresh","Sunita","Sunil","Radha","Rajesh","Lata","Mukesh","Kamla","Pankaj","Seema"]

const lastNames = ["Sharma","Kumar","Singh","Verma","Gupta","Devi","Kumari","Mahato","Oraon","Mishra","Yadav","Sinha","Tiwari","Pandey","Jha","Prasad","Dubey","Trivedi","Shukla","Patel","Shah","Jain","Agarwal","Saxena","Srivastava","Chatterjee","Banerjee","Das","Roy","Ghosh","Mandal","Murmu","Soren","Hembram","Besra","Tudu","Kisku","Hansda","Mandi","Majhi"]

const languagesByCity = {
  Ranchi:     ["Hindi","English","Nagpuri","Kurukh"],
  Jamshedpur: ["Hindi","English","Bengali","Odia"],
  Dhanbad:    ["Hindi","English","Bengali","Bhojpuri"],
  Bokaro:     ["Hindi","English","Bengali"],
  Hazaribagh: ["Hindi","English","Nagpuri"],
  Deoghar:    ["Hindi","English","Bengali","Santali"],
  Giridih:    ["Hindi","English","Nagpuri"],
  Dumka:      ["Hindi","Santali","Bengali","English"],
}

const aboutBySpeciality = {
  "General Physician":   "Experienced general physician providing comprehensive primary healthcare.",
  "Cardiologist":        "Specialist in heart diseases, ECG, echocardiography and cardiac management.",
  "Neurologist":         "Expert in neurological disorders including stroke, epilepsy and headache.",
  "Orthopedist":         "Specialist in bone, joint and muscle disorders including fractures and arthritis.",
  "Gynecologist":        "Expert in women health, pregnancy, maternal care and reproductive medicine.",
  "Pediatrician":        "Child health specialist focusing on growth, development and pediatric diseases.",
  "Dermatologist":       "Skin specialist treating infections, allergies, acne and cosmetic conditions.",
  "Psychiatrist":        "Mental health expert specializing in anxiety, depression and behavioral disorders.",
  "Oncologist":          "Cancer specialist providing chemotherapy, radiation and oncology management.",
  "Nephrologist":        "Kidney specialist managing renal failure, dialysis and transplant cases.",
  "Ophthalmologist":     "Eye specialist treating cataract, glaucoma and retinal disorders.",
  "ENT Specialist":      "Ear nose throat specialist managing sinus, hearing and throat conditions.",
  "Gastroenterologist":  "Digestive system specialist treating liver, intestine and stomach disorders.",
  "Pulmonologist":       "Lung specialist managing asthma, COPD and respiratory infections.",
  "Endocrinologist":     "Hormone specialist managing diabetes, thyroid and hormonal disorders.",
}

const feeBySpeciality = {
  "General Physician":   [200,250,300,350],
  "Cardiologist":        [600,700,800,900,1000],
  "Neurologist":         [700,800,900,1000],
  "Orthopedist":         [500,600,700,800],
  "Gynecologist":        [400,500,600,700],
  "Pediatrician":        [300,400,500],
  "Dermatologist":       [350,400,500,600],
  "Psychiatrist":        [500,600,700],
  "Oncologist":          [900,1000,1100,1200],
  "Nephrologist":        [700,800,900,1000],
  "Ophthalmologist":     [400,500,600],
  "ENT Specialist":      [400,500,600],
  "Gastroenterologist":  [600,700,800],
  "Pulmonologist":       [500,600,700],
  "Endocrinologist":     [600,700,800],
}

const usedNames = new Set()

const generateDoctorName = () => {
  let name
  let attempts = 0
  do {
    const first = firstNames[Math.floor(Math.random() * firstNames.length)]
    const last = lastNames[Math.floor(Math.random() * lastNames.length)]
    name = "Dr. " + first + " " + last
    attempts++
  } while (usedNames.has(name) && attempts < 100)
  usedNames.add(name)
  return name
}

const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)]
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const randomRating = () => parseFloat((4.0 + Math.random() * 0.9).toFixed(1))
const randomPhone = () => "9" + randomInt(100000000, 999999999).toString()

const generateDoctors = (hospitals) => {
  const doctors = []
  for (const hospital of hospitals) {
    const depts = hospital.departments
    for (const dept of depts) {
      for (let i = 0; i < 8; i++) {
        const fees = feeBySpeciality[dept] || [400,500,600]
        const langs = languagesByCity[hospital.city] || ["Hindi","English"]
        doctors.push({
          name:        generateDoctorName(),
          speciality:  dept,
          hospital:    hospital.name,
          hospitalId:  hospital._id,
          city:        hospital.city,
          experience:  randomInt(3, 20),
          fee:         randomFrom(fees),
          rating:      randomRating(),
          available:   Math.random() > 0.2,
          phone:       randomPhone(),
          about:       aboutBySpeciality[dept] || "Experienced specialist doctor.",
          languages:   langs.slice(0, randomInt(1, Math.min(3, langs.length))),
          slots:       ["09:00 AM","10:00 AM","11:00 AM","12:00 PM","02:00 PM","03:00 PM","04:00 PM"],
        })
      }
    }
  }
  return doctors
}

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("MongoDB connected")

    await Hospital.deleteMany({})
    await Doctor.deleteMany({})
    console.log("Cleared existing data")

    const allHospitals = []
    for (const [city, data] of Object.entries(cityData)) {
      for (const h of data.hospitals) {
        const depts = h.type === "Government" ? departmentsByType.Government : departmentsByType.Private
        allHospitals.push({ ...h, city, departments: depts })
      }
    }

    const insertedHospitals = await Hospital.insertMany(allHospitals)
    console.log(insertedHospitals.length + " hospitals inserted")

    const doctors = generateDoctors(insertedHospitals)
    await Doctor.insertMany(doctors)
    console.log(doctors.length + " doctors inserted")

    const cities = [...new Set(insertedHospitals.map(h => h.city))]
    for (const city of cities) {
      const h = insertedHospitals.filter(h => h.city === city).length
      const d = doctors.filter(d => d.city === city).length
      console.log(city + ": " + h + " hospitals, " + d + " doctors")
    }

    console.log("\nTotal hospitals: " + insertedHospitals.length)
    console.log("Total doctors: " + doctors.length)
    console.log("\nDatabase seeded successfully!")
    process.exit(0)

  } catch (error) {
    console.error("Seed error:", error.message)
    process.exit(1)
  }
}

seedDB()
