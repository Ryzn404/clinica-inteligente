import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import User from '../models/User.js'

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['patient', 'secretary']).optional()
})

export const register = async (req, res) => {
  try {
    const data = registerSchema.parse(req.body)
    const exists = await User.findOne({ email: data.email })
    if (exists) return res.status(400).json({ error: 'E-mail já cadastrado' })
    const passwordHash = await bcrypt.hash(data.password, 10)
    const user = await User.create({ ...data, passwordHash })
    res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role })
  } catch (e) {
    res.status(400).json({ error: e.errors?.[0]?.message || e.message })
  }
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

export const login = async (req, res) => {
  try {
    const data = loginSchema.parse(req.body)
    const user = await User.findOne({ email: data.email })
    if (!user) return res.status(400).json({ error: 'Credenciais inválidas' })
    const ok = await bcrypt.compare(data.password, user.passwordHash)
    if (!ok) return res.status(400).json({ error: 'Credenciais inválidas' })
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '8h' })
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } })
  } catch (e) {
    res.status(400).json({ error: e.errors?.[0]?.message || e.message })
  }
}

export const me = async (req, res) => {
  const { _id, name, email, role } = req.user
  res.json({ id: _id, name, email, role })
}
