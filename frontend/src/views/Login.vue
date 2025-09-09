<template>
  <div class="card">
    <h2>Entrar</h2>
    <form @submit.prevent="submit">
      <input v-model="email" type="email" placeholder="E-mail" required />
      <input v-model="password" type="password" placeholder="Senha" required />
      <button>Entrar</button>
    </form>
    <p>Ainda não tem conta? <router-link to="/register">Cadastre-se</router-link></p>
    <p><strong>Demos:</strong> secretaria@clinic.com / 123456 — paciente@clinic.com / 123456</p>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useAuth } from '../store/auth'
import { useRouter } from 'vue-router'
const email = ref('')
const password = ref('')
const auth = useAuth()
const router = useRouter()
async function submit() {
  try{
    await auth.login(email.value, password.value)
    router.push('/dashboard')
  }catch(e){
    alert(e.response?.data?.error || e.message)
  }
}
</script>
