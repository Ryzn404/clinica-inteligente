import { Router } from 'express'
import { authRequired, role } from '../middlewares/auth.js'
import { create, list, mine, remove } from '../controllers/appointment.controller.js'

const r = Router()

r.use(authRequired)

r.post('/', create)                            // criar agendamento
r.get('/', role(['secretary']), list)          // listar todos (secretário)
r.get('/mine', mine)                           // meus agendamentos (paciente)
r.delete('/:id', role(['secretary']), remove)  // remover (secretário)

export default r
