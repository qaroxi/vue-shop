import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/login/login.vue'
import Home from '../views/home/home.vue'
import Users from '../views/home/data/user/users.vue'

Vue.use(VueRouter)

const routes = [
  // 登录路由
  {
    name:'login',
    path: '/login',
    component:Login,
  },
  // 首页路由
  {
    name:'home',
    path: '/',
    component:Home,
    children:[
      // 用户路由
      {
        name:'users',
        path:'users',
        component:Users,
      }
    ],
  },
]

const router = new VueRouter({
  routes
})

export default router
