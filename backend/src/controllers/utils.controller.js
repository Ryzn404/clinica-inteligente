import axios from 'axios'

export const cepLookup = async (req, res) => {
  try {
    const { cep } = req.params
    const clean = cep.replace(/\D/g, '')
    const r = await axios.get(`https://viacep.com.br/ws/${clean}/json/`)
    res.json(r.data)
  } catch (e) {
    res.status(400).json({ error: 'CEP inválido' })
  }
}

export const weather = async (req, res) => {
  try {
    const key = process.env.OWM_KEY
    if (!key) return res.status(400).json({ error: 'OWM_KEY não configurado' })
    const units = process.env.OWM_UNITS || 'metric'
    const { city } = req.query
    if (!city) return res.status(400).json({ error: 'city é obrigatório' })
    const url = 'https://api.openweathermap.org/data/2.5/forecast'
    const r = await axios.get(url, { params: { q: city, appid: key, units } })
    res.json(r.data)
  } catch (e) {
    res.status(400).json({ error: 'Erro ao consultar clima' })
  }
}
