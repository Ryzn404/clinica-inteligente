import { z } from 'zod'
import Appointment from '../models/Appointment.js'
import axios from 'axios'

const apptSchema = z.object({
  patientId: z.string().min(1),
  date: z.string().datetime(), 
  reason: z.string().optional(),
  cep: z.string().min(8).max(9).optional()
})

async function fetchCep(cep) {
  if (!cep) return null
  const clean = cep.replace(/\D/g, '')
  const r = await axios.get(`https://viacep.com.br/ws/${clean}/json/`)
  return r.data
}

async function fetchWeather(city, dateISO) {
  if (!city) return null
  const key = process.env.OWM_KEY
  if (!key) return null
  const units = process.env.OWM_UNITS || 'metric'

  const url = 'https://api.openweathermap.org/data/2.5/forecast'
  const r = await axios.get(url, { params: { q: city, appid: key, units } })
  const list = r.data?.list || []
  const target = new Date(dateISO).getTime()
  let best = null, bestDiff = Infinity
  for (const it of list) {
    const t = (it.dt || 0) * 1000
    const diff = Math.abs(t - target)
    if (diff < bestDiff) { best = it; bestDiff = diff }
  }
  if (!best) return null
  const rain = (best.rain && (best.rain['3h'] || best.rain['1h'])) || 0
  const weatherMain = best.weather?.[0]?.main || 'Clear'
  return { at: best.dt, rainVolume: rain, weatherMain, raw: best }
}

export const create = async (req, res) => {
  try {
    const data = apptSchema.parse(req.body)
    const when = new Date(data.date)

    const windowMs = 30 * 60 * 1000
    const from = new Date(when.getTime() - windowMs)
    const to = new Date(when.getTime() + windowMs)

    const conflict = await Appointment.findOne({
      patient: data.patientId,
      date: { $gte: from, $lte: to }
    })

    if (conflict) return res.status(409).json({ error: 'Já existe consulta próxima a esse horário' })

    let addressSnapshot = null
    let city = null
    if (data.cep) {
      addressSnapshot = await fetchCep(data.cep)
      city = addressSnapshot?.localidade
    }

    const weatherSnapshot = await fetchWeather(city, data.date)

    const appt = await Appointment.create({
      patient: data.patientId,
      date: when,
      reason: data.reason,
      addressSnapshot,
      weatherSnapshot,
      createdBy: req.user._id
    })
    res.status(201).json(appt)
  } catch (e) {
    const msg = e.errors?.[0]?.message || e.response?.data?.message || e.message
    res.status(400).json({ error: msg })
  }
}

export const list = async (req, res) => {
  const items = await Appointment.find().populate('patient', 'name email role').sort({ date: 1 })
  res.json(items)
}

export const mine = async (req, res) => {
  const items = await Appointment.find({ patient: req.user._id }).sort({ date: 1 })
  res.json(items)
}

export const remove = async (req, res) => {
  const { id } = req.params
  await Appointment.findByIdAndDelete(id)
  res.json({ ok: true })
}
