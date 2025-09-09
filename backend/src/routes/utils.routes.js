import { Router } from 'express'
import { cepLookup, weather } from '../controllers/utils.controller.js'
const r = Router()

r.get('/cep/:cep', cepLookup)
r.get('/weather', weather)

export default r
