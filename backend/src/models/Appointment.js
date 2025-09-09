import mongoose from 'mongoose'

const AppointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  reason: { type: String },
  addressSnapshot: { type: Object }, // endereço resolvido via CEP
  weatherSnapshot: { type: Object }, // resultado de chuva no dia/hora
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true })

AppointmentSchema.index({ date: 1, patient: 1 }, { unique: false })

export default mongoose.model('Appointment', AppointmentSchema)
