<template>
  <div class="card">
    <h2>Meu Painel</h2>
    <form @submit.prevent="agendar">
      <label>Data/Hora</label>
      <input v-model="date" type="datetime-local" required />
      <label>CEP (opcional)</label>
      <input v-model="cep" placeholder="00000-000" @blur="buscarCEP" />
      <label>Motivo</label>
      <input v-model="reason" placeholder="Ex.: Retorno" />
      <button>Agendar</button>
    </form>

    <div v-if="address">
      <h3>Endereço detectado</h3>
      <pre>{{ address }}</pre>
    </div>

    <div>
      <h3>Meus Agendamentos</h3>
      <table>
        <thead><tr><th>Data</th><th>Chuva?</th><th>Motivo</th></tr></thead>
        <tbody>
          <tr v-for="a in mine" :key="a._id">
            <td>{{ new Date(a.date).toLocaleString() }}</td>
            <td>
              <span v-if="a.weatherSnapshot">
                {{ a.weatherSnapshot.weatherMain }} / chuva: {{ a.weatherSnapshot.rainVolume || 0 }}
              </span>
              <span v-else>—</span>
            </td>
            <td>{{ a.reason || '—' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'
const date = ref('')
const cep = ref('')
const reason = ref('')
const mine = ref([])
const address = ref(null)

async function buscarCEP(){
  if(!cep.value) return
  try{
    const { data } = await api.get(`/utils/cep/${cep.value}`)
    if (data?.erro) throw new Error('CEP não encontrado')
    address.value = data
  }catch(e){
    alert(e.response?.data?.error || e.message)
  }
}

async function carregar(){
  const { data } = await api.get('/appointments/mine')
  mine.value = data
}
async function agendar(){
  try{
    const patientId = (await api.get('/auth/me')).data.id
    await api.post('/appointments', { patientId, date: new Date(date.value).toISOString(), reason: reason.value, cep: cep.value })
    alert('Agendado!')
    await carregar()
  }catch(e){
    alert(e.response?.data?.error || e.message)
  }
}
onMounted(() => carregar())
</script>
