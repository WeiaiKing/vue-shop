import Vue from 'vue';
import './plugins/axios';
import App from './App.vue';
import router from './router';
import './plugins/element.js';
import './assets/css/global.css';
import './assets/font/iconfont.css';
import ZkTable from 'vue-table-with-tree-grid';
import axios from 'axios';
import VueQuillEditor from 'vue-quill-editor';
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

Vue.use(VueQuillEditor /* { default global options } */);
Vue.component('ZkTable', ZkTable);
Vue.config.productionTip = false;
// 设置请求的根路径
axios.defaults.baseURL = 'http://www.wandaershoushu.club';
// axios挂载到vue原型对象上，这样的话没个组件都可以通过
// this.访问到这axios
// axios.prototype.$http = axios;
// axios.defaults.header['Content-Type'] = 'application/x-www-form-urlencoded';

// Vue.filter('dateFormat',function(originVal){
//    const dt = new Date(originVal)
//    const y = dt.getFullYear()
//    const m = (dt.getMonth() + 1 +'').padStart(2,'0')
//    const d = (dt.getDate()+'').padStart(2,'0')
//    const hh = (dt.getHours() + '').padStart(2,'0')
//    const mm = (dt.getMinutes()+'').padStart(2,'0')
//    const ss = (dt.getSeconds()+'').padStart(2,'0')

//    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
// })

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
