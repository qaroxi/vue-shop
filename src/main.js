import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios';
import './assets/css/basic.css';//引入全局样式
import App from './App.vue';
import router from './router';
import store from './store';
import Moment from 'moment';//引入日期格式转换插件

Vue.config.productionTip = false;
// 配置axios
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/';//设置默认请求地址
axios.interceptors.request.use(config=>{
  // 设置请求拦截器，对除登录以外的请求添加请求头
  if(config.url != 'login'){
    //获取token值
    const token = localStorage.getItem('token');
    //设置请求头
    config.headers['Authorization'] = token;
  }
  return config
  })
Vue.prototype.$axios = axios;

// 定义全局过滤器，转换日期格式
Vue.filter('changeData', function (value) {
  value = value*1000;
  return Moment(value).format('YYYY-MM-DD', 'HH-MM-SS');
})

Vue.use(ElementUI);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
