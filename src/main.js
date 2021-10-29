import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios';
import './assets/css/base.css';//引入全局样式
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/';//设置默认请求地址
Vue.prototype.$axios = axios;

Vue.use(ElementUI);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
