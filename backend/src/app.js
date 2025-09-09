import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import mongoose from 'mongoose'
import rateLimit from 'express-rate-limit'
import { corsOptions } from './config/cors.js'
import authRoutes from './routes/auth.routes.js'
import apptRoutes from './routes/appointment.routes.js'
import utilRoutes from './routes/utils.routes.js'

const app = express()

// Middlewares
app.use(helmet())
app.use(cors(corsOptions))
app.use(express.json())
app.use(morgan('dev'))

// Rate limit para auth
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })
app.use('/auth', authLimiter)

// Mongo
const uri = process.env.MONGO_URI
if (!uri) throw new Error('MONGO_URI não definido')
mongoose.connect(uri).then(() => console.log('MongoDB conectado')).catch(console.error)

// Rotas
app.get('/', (_, res) => res.json({ ok: true, name: 'Clinica Inteligente API' }))
app.use('/auth', authRoutes)
app.use('/appointments', apptRoutes)
app.use('/utils', utilRoutes)

// Handler 404
app.use((req, res) => res.status(404).json({ error: 'Not Found' }))

// Handler erros
app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' })
})

export default app
