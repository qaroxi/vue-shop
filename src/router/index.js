import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/login/login.vue'
import Home from '../views/home/home.vue'
import Users from '../views/home/data/user/users.vue'
import Rights from '../views/home/data/power/rights.vue'
import Roles from '../views/home/data/power/roles.vue'
import Goods from '../views/home/data/goods/goodsList.vue'
import Params from '../views/home/data/goods/parameter.vue'
import Categories from '../views/home/data/goods/classification.vue'
import GoodsAdd from '../views/home/data/goods/goodsAdd.vue'
import Orders from '../views/home/data/order/orders.vue'
import Reports from '../views/home/data/report/reports.vue'

// 引入element ui 的消息提示
import { Message } from 'element-ui';

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
      },

      // 商品管理--商品列表
      {
        name:'goods',
        path:'goods',
        component:Goods,
      },

      // 商品管理--分类参数
      {
        name:'params',
        path:'params',
        component:Params,
      },

      // 商品管理--商品分类
      {
        name:'categories',
        path:'categories',
        component:Categories,
      },

      // 商品管理--添加商品
      {
        name:'goodsAdd',
        path:'addgoods',
        component:GoodsAdd,
      },

      // 订单管理--订单列表
      {
        name:'orders',
        path:'orders',
        component:Orders,
      },

      // 数据统计--数据报表
      {
        name:'reports',
        path:'reports',
        component:Reports,
      },

    ],
  },
]

const router = new VueRouter({
  routes
})

// 路由前置守卫
router.beforeEach((to, from, next) => {
  // 判断用户是否登录，否则进行登录
  if(to.path != '/login'){
    let token = localStorage.getItem('token');
      if(!token){
        // 提示未登录
        Message({
          message: '未登录，请先登录！',
          type: 'warning'
        });
        // 跳转至登录界面
        router.replace({name:'login'});
        return;
      }
    next();
  }else{
    next();
  }
})


export default router
