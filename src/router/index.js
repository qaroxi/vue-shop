import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/login/login.vue'
import Home from '../views/home/home.vue'

Vue.use(VueRouter)

const routes = [
  {
    name:'login',
    path: '/login',
    component:Login,
  },
  {
    name:'home',
    path: '/',
    component:Home,
  },
]

const router = new VueRouter({
  routes
})

export default router
