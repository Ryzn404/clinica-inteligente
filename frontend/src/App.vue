<template>
  <div class="container">
    <nav style="display:flex; gap:12px; padding:12px; border-bottom:1px solid #ddd;">
      <router-link to="/">Início</router-link>
      <router-link to="/dashboard">Painel</router-link>
      <router-link to="/admin">Admin</router-link>
      <span style="flex:1"></span>
      <button v-if="!isAuth" @click="$router.push('/login')">Entrar</button>
      <button v-else @click="logout">Sair</button>
    </nav>
    <router-view />
  </div>
</template>

<script setup>
import { useAuth } from './store/auth'
const auth = useAuth()
const isAuth = computed(() => !!auth.token)
function logout(){ auth.logout(); }
</script>

<style>
body{ font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, 'Helvetica Neue', Arial; margin:0; background:#fafafa; }
.container{ max-width: 920px; margin: 0 auto; }
input, button, select, textarea { padding: 8px; border:1px solid #ccc; border-radius:8px; }
form { display:flex; flex-direction:column; gap:10px; margin: 16px 0; }
.card { background:#fff; padding:16px; border-radius:12px; box-shadow: 0 2px 12px rgba(0,0,0,.06); margin: 16px 0; }
table { width:100%; border-collapse: collapse; }
th, td { border-bottom:1px solid #eee; padding:8px; text-align:left; }
</style>
