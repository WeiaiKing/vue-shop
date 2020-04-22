import Vue from 'vue';
import './plugins/axios';
import App from './App.vue';
import router from './router';
import './plugins/element.js';
import './assets/css/global.css';
import './assets/font/iconfont.css';
import axios from 'axios';

Vue.config.productionTip = false;
// 设置请求的根路径
axios.defaults.baseURL = 'http://www.wandaershoushu.club';
// axios挂载到vue原型对象上，这样的话没个组件都可以通过
// this.访问到这axios
// axios.prototype.$http = axios;
// axios.defaults.header['Content-Type'] = 'application/x-www-form-urlencoded';

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
