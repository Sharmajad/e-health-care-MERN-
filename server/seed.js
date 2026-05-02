
import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()
import Hospital from "./src/models/Hospital.js"
import Doctor from "./src/models/Doctor.js"

const hospitals = [
  { name: "RIMS", city: "Ranchi", address: "Bariatu Road, Ranchi", phone: "0651-2451070", ambulance: "0651-2451071", lat: 23.3561, lng: 85.3096, type: "Government", emergency: true, departments: ["General Physician","Cardiologist","Neurologist","Orthopedist","Gynecologist","Pediatrician","Oncologist","Psychiatrist","ENT Specialist","Dermatologist","Nephrologist","Ophthalmologist"] },
  { name: "Medanta Hospital Ranchi", city: "Ranchi", address: "Jail Road, Ranchi", phone: "0651-3520000", ambulance: "0651-3520001", lat: 23.3441, lng: 85.3096, type: "Private", emergency: true, departments: ["Cardiologist","Neurologist","Orthopedist","Gynecologist","Gastroenterologist","Nephrologist","Oncologist"] },
  { name: "AIIMS Ranchi", city: "Ranchi", address: "Tupudana, Ranchi", phone: "0651-2451100", ambulance: "0651-2451101", lat: 23.3200, lng: 85.2800, type: "Government", emergency: true, departments: ["General Physician","Cardiologist","Neurologist","Pediatrician","Gynecologist","Orthopedist","Dermatologist","Psychiatrist"] },
  { name: "CIP Kanke", city: "Ranchi", address: "Kanke Road, Ranchi", phone: "0651-2451082", ambulance: "0651-2451082", lat: 23.3900, lng: 85.3200, type: "Government", emergency: false, departments: ["Psychiatrist","Neurologist","General Physician"] },
  { name: "Orchid Medical Centre", city: "Ranchi", address: "Circular Road, Ranchi", phone: "0651-2331122", ambulance: "0651-2331122", lat: 23.3600, lng: 85.3300, type: "Private", emergency: true, departments: ["General Physician","Cardiologist","Dermatologist","Gynecologist","Pediatrician"] },
  { name: "Tata Main Hospital (TMH)", city: "Jamshedpur", address: "C Road, Bistupur, Jamshedpur", phone: "0657-2428570", ambulance: "0657-2428571", lat: 22.8046, lng: 86.2029, type: "Private", emergency: true, departments: ["General Physician","Cardiologist","Neurologist","Orthopedist","Oncologist","Gynecologist","Pediatrician","ENT Specialist"] },
  { name: "MGM Medical College Hospital", city: "Jamshedpur", address: "Dimna Road, Mango, Jamshedpur", phone: "0657-2387100", ambulance: "0657-2387101", lat: 22.8200, lng: 86.2200, type: "Government", emergency: true, departments: ["General Physician","Gynecologist","Pediatrician","Orthopedist","Dermatologist"] },
  { name: "Brahmanand Narayana Hospital", city: "Jamshedpur", address: "Adityapur, Jamshedpur", phone: "0657-6677777", ambulance: "0657-6677778", lat: 22.7800, lng: 86.1800, type: "Private", emergency: true, departments: ["Cardiologist","Neurologist","Orthopedist","Gastroenterologist"] },
  { name: "SNMMCH Saraidhela", city: "Dhanbad", address: "Saraidhela, Dhanbad", phone: "0326-2310627", ambulance: "0326-2310628", lat: 23.7957, lng: 86.4304, type: "Government", emergency: true, departments: ["General Physician","Gynecologist","Pediatrician","Orthopedist"] },
  { name: "PMCH Dhanbad", city: "Dhanbad", address: "Putki, Dhanbad", phone: "0326-2315151", ambulance: "0326-2315152", lat: 23.8000, lng: 86.4500, type: "Government", emergency: true, departments: ["General Physician","Cardiologist","Gynecologist"] },
  { name: "Apollo Clinic Dhanbad", city: "Dhanbad", address: "Bank More, Dhanbad", phone: "0326-2300100", ambulance: "0326-2300101", lat: 23.7900, lng: 86.4400, type: "Private", emergency: false, departments: ["General Physician","Dermatologist","Cardiologist"] },
  { name: "Bokaro General Hospital", city: "Bokaro", address: "Sector 4, Bokaro Steel City", phone: "06542-233100", ambulance: "06542-233101", lat: 23.6693, lng: 86.1511, type: "Government", emergency: true, departments: ["General Physician","Cardiologist","Gynecologist","Pediatrician","Orthopedist"] },
  { name: "SAIL Bokaro Steel Hospital", city: "Bokaro", address: "Sector 1, Bokaro Steel City", phone: "06542-233200", ambulance: "06542-233201", lat: 23.6700, lng: 86.1600, type: "Private", emergency: true, departments: ["General Physician","Cardiologist","Neurologist","Orthopedist"] },
  { name: "Sadar Hospital Hazaribagh", city: "Hazaribagh", address: "GT Road, Hazaribagh", phone: "06546-222344", ambulance: "06546-222345", lat: 23.9925, lng: 85.3637, type: "Government", emergency: true, departments: ["General Physician","Gynecologist","Pediatrician"] },
  { name: "Hazaribagh Medical College", city: "Hazaribagh", address: "Demotand, Hazaribagh", phone: "06546-224455", ambulance: "06546-224456", lat: 23.9800, lng: 85.3500, type: "Government", emergency: true, departments: ["General Physician","Gynecologist","Pediatrician","Orthopedist"] },
  { name: "AIIMS Deoghar", city: "Deoghar", address: "Devipur, Deoghar", phone: "06432-222100", ambulance: "06432-222101", lat: 24.4800, lng: 86.7000, type: "Government", emergency: true, departments: ["General Physician","Cardiologist","Neurologist","Gynecologist","Pediatrician","Orthopedist"] },
  { name: "Sadar Hospital Deoghar", city: "Deoghar", address: "Tower Chowk, Deoghar", phone: "06432-222200", ambulance: "06432-222201", lat: 24.4850, lng: 86.7050, type: "Government", emergency: true, departments: ["General Physician","Gynecologist","Pediatrician"] },
  { name: "Sadar Hospital Giridih", city: "Giridih", address: "Main Road, Giridih", phone: "06532-222100", ambulance: "06532-222101", lat: 24.1900, lng: 86.3000, type: "Government", emergency: true, departments: ["General Physician","Gynecologist"] },
  { name: "Phulo Jhano Medical College", city: "Dumka", address: "Dumka Road, Dumka", phone: "06434-222100", ambulance: "06434-222101", lat: 24.2700, lng: 87.2500, type: "Government", emergency: true, departments: ["General Physician","Gynecologist","Pediatrician"] },
]

const doctors = [
  { name: "Dr. Priya Sharma",    speciality: "Cardiologist",     hospital: "RIMS",                        city: "Ranchi",     experience: 14, fee: 800,  rating: 4.8, available: true,  phone: "9876543210", languages: ["Hindi","English"],         about: "Senior Cardiologist with 14 years at RIMS. Specializes in interventional cardiology." },
  { name: "Dr. Ramesh Gupta",    speciality: "Cardiologist",     hospital: "Medanta Hospital Ranchi",     city: "Ranchi",     experience: 10, fee: 700,  rating: 4.6, available: true,  phone: "9876543211", languages: ["Hindi","English"],         about: "Experienced cardiologist specializing in heart failure management." },
  { name: "Dr. Amit Kumar",      speciality: "Neurologist",      hospital: "Tata Main Hospital (TMH)",    city: "Jamshedpur", experience: 11, fee: 1000, rating: 4.7, available: true,  phone: "9876543212", languages: ["Hindi","English","Bengali"], about: "Neurologist at TMH with expertise in stroke and epilepsy." },
  { name: "Dr. Sunita Verma",    speciality: "Neurologist",      hospital: "AIIMS Ranchi",                city: "Ranchi",     experience: 8,  fee: 800,  rating: 4.5, available: true,  phone: "9876543213", languages: ["Hindi","English"],         about: "AIIMS trained neurologist specializing in headache disorders." },
  { name: "Dr. Sunita Devi",     speciality: "Gynecologist",     hospital: "Medanta Hospital Ranchi",     city: "Ranchi",     experience: 12, fee: 600,  rating: 4.9, available: false, phone: "9876543214", languages: ["Hindi","English"],         about: "Senior gynecologist with expertise in high-risk pregnancies." },
  { name: "Dr. Meena Kumari",    speciality: "Gynecologist",     hospital: "MGM Medical College Hospital",city: "Jamshedpur", experience: 9,  fee: 500,  rating: 4.7, available: true,  phone: "9876543215", languages: ["Hindi","Bhojpuri"],        about: "Gynecologist at MGM with focus on maternal health." },
  { name: "Dr. Rakesh Singh",    speciality: "Pediatrician",     hospital: "SNMMCH Saraidhela",           city: "Dhanbad",    experience: 9,  fee: 400,  rating: 4.6, available: true,  phone: "9876543216", languages: ["Hindi","English"],         about: "Pediatrician with 9 years experience in child healthcare." },
  { name: "Dr. Anita Sharma",    speciality: "Pediatrician",     hospital: "Bokaro General Hospital",     city: "Bokaro",     experience: 7,  fee: 350,  rating: 4.5, available: true,  phone: "9876543217", languages: ["Hindi","English"],         about: "Child specialist with focus on neonatal care." },
  { name: "Dr. Meera Kumari",    speciality: "Dermatologist",    hospital: "Bokaro General Hospital",     city: "Bokaro",     experience: 8,  fee: 500,  rating: 4.5, available: true,  phone: "9876543218", languages: ["Hindi","English"],         about: "Dermatologist specializing in skin infections and allergies." },
  { name: "Dr. Vijay Ranjan",    speciality: "Dermatologist",    hospital: "RIMS",                        city: "Ranchi",     experience: 6,  fee: 400,  rating: 4.4, available: true,  phone: "9876543219", languages: ["Hindi","English"],         about: "Dermatologist at RIMS with focus on cosmetic dermatology." },
  { name: "Dr. Vijay Mahato",    speciality: "General Physician",hospital: "Sadar Hospital Hazaribagh",   city: "Hazaribagh", experience: 15, fee: 300,  rating: 4.4, available: true,  phone: "9876543220", languages: ["Hindi","Nagpuri"],         about: "General physician with 15 years of primary care experience." },
  { name: "Dr. Sanjay Kumar",    speciality: "General Physician",hospital: "Sadar Hospital Giridih",      city: "Giridih",    experience: 12, fee: 250,  rating: 4.3, available: true,  phone: "9876543221", languages: ["Hindi"],                   about: "Primary care physician serving Giridih for over a decade." },
  { name: "Dr. Suresh Oraon",    speciality: "Orthopedist",      hospital: "MGM Medical College Hospital",city: "Jamshedpur", experience: 13, fee: 700,  rating: 4.6, available: true,  phone: "9876543222", languages: ["Hindi","English","Kurukh"],  about: "Orthopedic surgeon specializing in joint replacement." },
  { name: "Dr. Prakash Singh",   speciality: "Orthopedist",      hospital: "Tata Main Hospital (TMH)",    city: "Jamshedpur", experience: 10, fee: 600,  rating: 4.5, available: true,  phone: "9876543223", languages: ["Hindi","English"],         about: "Orthopedist at TMH with expertise in sports injuries." },
  { name: "Dr. Anjali Gupta",    speciality: "Psychiatrist",     hospital: "CIP Kanke",                   city: "Ranchi",     experience: 10, fee: 600,  rating: 4.8, available: false, phone: "9876543224", languages: ["Hindi","English"],         about: "Psychiatrist at CIP Kanke specializing in mood disorders." },
  { name: "Dr. Rahul Mishra",    speciality: "Psychiatrist",     hospital: "AIIMS Ranchi",                city: "Ranchi",     experience: 7,  fee: 500,  rating: 4.6, available: true,  phone: "9876543225", languages: ["Hindi","English"],         about: "Psychiatrist focusing on anxiety and depression treatment." },
  { name: "Dr. Deepak Sharma",   speciality: "Oncologist",       hospital: "RIMS",                        city: "Ranchi",     experience: 16, fee: 1200, rating: 4.9, available: true,  phone: "9876543226", languages: ["Hindi","English"],         about: "Senior oncologist with 16 years in cancer treatment." },
  { name: "Dr. Kavita Singh",    speciality: "Oncologist",       hospital: "Tata Main Hospital (TMH)",    city: "Jamshedpur", experience: 12, fee: 1000, rating: 4.7, available: true,  phone: "9876543227", languages: ["Hindi","English"],         about: "Oncologist at TMH specializing in breast and cervical cancer." },
  { name: "Dr. Manoj Kumar",     speciality: "Gastroenterologist",hospital: "Brahmanand Narayana Hospital",city: "Jamshedpur",experience: 11, fee: 800,  rating: 4.6, available: true,  phone: "9876543228", languages: ["Hindi","English"],         about: "Gastroenterologist specializing in liver disorders." },
  { name: "Dr. Anil Sharma",     speciality: "Nephrologist",     hospital: "Medanta Hospital Ranchi",     city: "Ranchi",     experience: 14, fee: 900,  rating: 4.7, available: true,  phone: "9876543229", languages: ["Hindi","English"],         about: "Nephrologist specializing in kidney disease and dialysis." },
  { name: "Dr. Vikash Gupta",    speciality: "ENT Specialist",   hospital: "Tata Main Hospital (TMH)",    city: "Jamshedpur", experience: 10, fee: 600,  rating: 4.6, available: true,  phone: "9876543230", languages: ["Hindi","English"],         about: "ENT specialist with expertise in sinus and hearing disorders." },
  { name: "Dr. Suman Devi",      speciality: "Ophthalmologist",  hospital: "RIMS",                        city: "Ranchi",     experience: 12, fee: 600,  rating: 4.7, available: true,  phone: "9876543231", languages: ["Hindi","English"],         about: "Eye specialist at RIMS with focus on cataract surgery." },
  { name: "Dr. Rohit Kumar",     speciality: "Ophthalmologist",  hospital: "Bokaro General Hospital",     city: "Bokaro",     experience: 8,  fee: 500,  rating: 4.5, available: true,  phone: "9876543232", languages: ["Hindi","English"],         about: "Ophthalmologist at Bokaro General specializing in retinal disorders." },
  { name: "Dr. Pooja Verma",     speciality: "Gastroenterologist",hospital: "RIMS",                       city: "Ranchi",     experience: 8,  fee: 700,  rating: 4.5, available: true,  phone: "9876543233", languages: ["Hindi","English"],         about: "Gastroenterologist with expertise in inflammatory bowel disease." },
  { name: "Dr. Ritu Singh",      speciality: "Nephrologist",     hospital: "AIIMS Ranchi",                city: "Ranchi",     experience: 9,  fee: 800,  rating: 4.5, available: true,  phone: "9876543234", languages: ["Hindi","English"],         about: "Nephrologist at AIIMS Ranchi focusing on transplant cases." },
  { name: "Dr. Neha Kumari",     speciality: "ENT Specialist",   hospital: "MGM Medical College Hospital",city: "Jamshedpur", experience: 7,  fee: 500,  rating: 4.4, available: true,  phone: "9876543235", languages: ["Hindi","English"],         about: "ENT specialist with focus on pediatric ear disorders." },
  { name: "Dr. Prem Narayan",    speciality: "General Physician",hospital: "AIIMS Deoghar",               city: "Deoghar",    experience: 10, fee: 300,  rating: 4.5, available: true,  phone: "9876543236", languages: ["Hindi","Santali"],         about: "General physician at AIIMS Deoghar serving tribal communities." },
  { name: "Dr. Savita Oraon",    speciality: "Gynecologist",     hospital: "Phulo Jhano Medical College", city: "Dumka",      experience: 8,  fee: 350,  rating: 4.6, available: true,  phone: "9876543237", languages: ["Hindi","Santali","Bengali"], about: "Gynecologist serving the Santhal Pargana region." },
]

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("MongoDB connected")

    await Hospital.deleteMany({})
    await Doctor.deleteMany({})
    console.log("Cleared existing data")

    const insertedHospitals = await Hospital.insertMany(hospitals)
    console.log(insertedHospitals.length + " hospitals inserted")

    const hospitalMap = {}
    insertedHospitals.forEach((h) => { hospitalMap[h.name] = h._id })

    const doctorsWithIds = doctors.map((d) => ({
      ...d,
      hospitalId: hospitalMap[d.hospital] || null,
    }))

    await Doctor.insertMany(doctorsWithIds)
    console.log(doctors.length + " doctors inserted")

    console.log("Database seeded successfully!")
    process.exit(0)

  } catch (error) {
    console.error("Seed error:", error.message)
    process.exit(1)
  }
}

seedDB()
