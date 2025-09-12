<template>
  <div>
    <!-- Cabeçalho fixo -->
    <header :class="['header', { scrolled: isScrolled }]">
      <h1 class="titulo">Clínica Inteligente</h1>

      <!-- Menu de navegação -->
      <div class="menu">
        <div class="links">
          <router-link to="/">Início</router-link>
          <router-link to="/dashboard">Painel</router-link>
          <router-link to="/admin">Admin</router-link>
        </div>

        <!-- Botão Entrar/Sair -->
        <div class="auth-btn">
          <button v-if="!isAuth" @click="$router.push('/login')">Entrar</button>
          <button v-else @click="logout">Sair</button>
        </div>
      </div>
    </header>

    <!-- Conteúdo principal -->
    <main class="container">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useAuth } from "./store/auth";

const auth = useAuth();
const isAuth = computed(() => !!auth.token);

function logout() {
  auth.logout();
}

const isScrolled = ref(false);

// Detecta quando o usuário rola a página
const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style>
body {
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, 'Helvetica Neue', Arial;
  margin: 0;
  background: #fafafa;
}

/* ===== CABEÇALHO FIXO ===== */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: white;
  transition: background 0.3s ease, box-shadow 0.3s ease;
  padding: 10px 20px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

/* Efeito quando rolar a página */
.header.scrolled {
  background: #f8f9fa;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.titulo {
  text-align: center;
  font-size: 1.8rem;
  margin: 0;
  font-size: 250%;
}

.menu {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 900px;
  margin-top: 8px;
}

.links {
  display: flex;
  gap: 20px;
}

.links a {
  text-decoration: none;
  color: #007bff;
  font-weight: 500;
  transition: color 0.2s ease;
  font-size: larger;
}

.links a:hover {
  color: #0056b3;
  text-decoration: underline;
}

.auth-btn button {
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 6px 14px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.auth-btn button:hover {
  background: #0056b3;
}

/* ===== CONTEÚDO ===== */
.container {
  max-width: 920px;
  margin: 120px auto 0; /* Espaço para não ficar atrás do cabeçalho */
  background: #fff;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

input, button, select, textarea {
  padding: 8px;
  border: 1px solid #d3dbe9;
  border-radius: 8px;
}

button {
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 6px 14px;
  cursor: pointer;
  transition: background 0.2s ease;
}

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 16px 0;
}

.card {
  background: #fff;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, .06);
  margin: 16px 0;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border-bottom: 1px solid #eee;
  padding: 8px;
  text-align: left;
}
</style>
