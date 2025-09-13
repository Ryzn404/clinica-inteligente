import { Router } from 'express'
import { authRequired, role } from '../middlewares/auth.js'
import { create, list, mine, remove } from '../controllers/appointment.controller.js'

const r = Router()

r.use(authRequired)

r.post('/', create)                            
r.get('/', role(['secretary']), list)          
r.get('/mine', mine)                           
r.delete('/:id', role(['secretary']), remove)  

export default r
