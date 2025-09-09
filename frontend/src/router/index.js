import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Dashboard from '../views/Dashboard.vue'
import Admin from '../views/Admin.vue'
import { useAuth } from '../store/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { path: '/dashboard', component: Dashboard, meta: { auth: true } },
    { path: '/admin', component: Admin, meta: { auth: true, role: 'secretary' } },
  ]
})

router.beforeEach((to) => {
  const auth = useAuth()
  if (to.meta.auth && !auth.token) {
    return '/login'
  }
  if (to.meta.role && auth.user?.role !== to.meta.role) {
    return '/'
  }
})

export default router
