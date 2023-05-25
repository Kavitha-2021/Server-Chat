import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import Signup from '../components/Signup.vue'
import Sidebar from '../components/Sidebar.vue'
import Profile from '../components/Profile.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home 
  },
  {
    path: '/signup',
    name: 'signup',
    component: Signup 
  },
  {
    path: '/sidebar',
    name: 'sidebar',
    component: Sidebar 
  },
  {
    path: '/profile/:username',
    name: 'profile',
    component: Profile,
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
