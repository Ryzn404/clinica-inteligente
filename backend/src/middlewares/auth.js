import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const authRequired = async (req, res, next) => {
  try {
    const header = req.headers.authorization || ''
    const token = header.replace('Bearer ', '')
    if (!token) return res.status(401).json({ error: 'Token ausente' })
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(payload.id).lean()
    if (!user) return res.status(401).json({ error: 'Usuário não encontrado' })
    req.user = user
    next()
  } catch (e) {
    return res.status(401).json({ error: 'Token inválido' })
  }
}

export const role = (roles = []) => (req, res, next) => {
  if (!roles.length) return next()
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Acesso negado' })
  }
  next()
}
