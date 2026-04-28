import Appointment from "../models/Appointment.js"

export const bookAppointment = async (req, res) => {
  try {
    const {
      patientName, city, hospital,
      speciality, date, time,
      consultType, problem, isEmergency, fee
    } = req.body

    if (!date || !time) {
      return res.status(400).json({ message: "Date and time are required" })
    }

    const appointment = await Appointment.create({
      patientId:   req.user.id,
      patientName: patientName || req.user.name,
      city,
      hospital,
      speciality,
      date,
      time,
      consultType:  consultType || "inperson",
      problem:      problem || "",
      isEmergency:  isEmergency || false,
      fee:          fee || 0,
      status:       "pending",
    })

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment,
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.user.id })
      .sort({ createdAt: -1 })

    res.json(appointments)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const appointment = await Appointment.findById(id)

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" })
    }

    if (appointment.patientId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" })
    }

    appointment.status = status
    await appointment.save()

    res.json({ message: "Status updated", appointment })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params

    const appointment = await Appointment.findById(id)

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" })
    }

    if (appointment.patientId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" })
    }

    appointment.status = "cancelled"
    await appointment.save()

    res.json({ message: "Appointment cancelled successfully" })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
