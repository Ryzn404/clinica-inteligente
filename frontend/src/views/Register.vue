<template>
  <div class="card">
    <h2>Cadastro</h2>
    <form @submit.prevent="submit">
      <input v-model="name" placeholder="Nome completo" required />
      <input v-model="email" type="email" placeholder="E-mail" required />
      <input v-model="password" type="password" minlength="6" placeholder="Senha (mín. 6)" required />
      <select v-model="role">
        <option value="patient">Paciente</option>
        <option value="secretary">Secretário(a)</option>
      </select>
      <button>Criar conta</button>
    </form>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import api from '../services/api'
import { useRouter } from 'vue-router'
const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const role = ref('patient')
async function submit(){
  try{
    await api.post('/auth/register', { name: name.value, email: email.value, password: password.value, role: role.value })
    alert('Conta criada! Faça login.')
    router.push('/login')
  }catch(e){
    alert(e.response?.data?.error || e.message)
  }
}
</script>
