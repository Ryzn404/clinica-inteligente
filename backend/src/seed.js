import mongoose from 'mongoose'
import 'dotenv/config'
import bcrypt from 'bcryptjs'
import User from './models/User.js'

async function run() {
  await mongoose.connect(process.env.MONGO_URI)
  console.log('Mongo conectado')

  const pwd = await bcrypt.hash('123456', 10)
  const secretary = await User.findOneAndUpdate(
    { email: 'secretaria@clinic.com' },
    { name: 'Secretária Demo', email: 'secretaria@clinic.com', passwordHash: pwd, role: 'secretary' },
    { upsert: true, new: true }
  )
  const patient = await User.findOneAndUpdate(
    { email: 'paciente@clinic.com' },
    { name: 'Paciente Demo', email: 'paciente@clinic.com', passwordHash: pwd, role: 'patient' },
    { upsert: true, new: true }
  )
  console.log('Seed ok:', { secretary: secretary.email, patient: patient.email })
  await mongoose.disconnect()
}
run().catch(console.error)
