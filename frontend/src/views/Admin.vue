<template>
  <div class="card">
    <h2>Painel Administrativo</h2>
    <p>Apenas secretários podem ver.</p>
    <table>
      <thead><tr><th>Paciente</th><th>Data</th><th>Chuva?</th><th>Ações</th></tr></thead>
      <tbody>
        <tr v-for="a in items" :key="a._id">
          <td>{{ a.patient?.name }} ({{ a.patient?.email }})</td>
          <td>{{ new Date(a.date).toLocaleString() }}</td>
          <td>
            <span v-if="a.weatherSnapshot">
              {{ a.weatherSnapshot.weatherMain }} / chuva(3h): {{ a.weatherSnapshot.rainVolume || 0 }}
            </span>
            <span v-else>—</span>
          </td>
          <td><button @click="remover(a._id)">Excluir</button></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'
const items = ref([])
async function carregar(){
  const { data } = await api.get('/appointments')
  items.value = data
}
async function remover(id){
  if(!confirm('Remover agendamento?')) return
  await api.delete(`/appointments/${id}`)
  await carregar()
}
onMounted(() => carregar())
</script>
