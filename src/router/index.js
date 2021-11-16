import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/login/login.vue'
import Home from '../views/home/home.vue'
import Users from '../views/home/data/user/users.vue'
import Rights from '../views/home/data/power/rights.vue'
import Roles from '../views/home/data/power/roles.vue'

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
      },

      // 权限管理--权限列表路由
      {
        name:'rights',
        path:'rights',
        component:Rights,
      },

      // 权限管理--角色列表路由
      {
        name:'roles',
        path:'roles',
        component:Roles,
      }

    ],
  },
]

const router = new VueRouter({
  routes
})

export default router
