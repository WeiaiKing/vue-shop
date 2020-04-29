import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '../components/Login.vue';
import Home from '../components/Home.vue';
import Welcome from '../components/Welcome.vue';
import Userlist from '../components/user/Userlist.vue'
import Rolelist from '../components/Jurisdiction/Rolelist.vue'

Vue.use(VueRouter);

const routes = [
    // 重定向
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/home',
        component: Home,
        redirect: '/welcome',
        children: [
            {
                path: '/welcome',
                component: Welcome
            },
            {
                path: '/userlist',
                component: Userlist
            },
            {
                path: '/rolelist',
                component: Rolelist
            }
        ]
    }
]

const router = new VueRouter({
    routes
});

router.beforeEach((to, from, next) => {
/**
 * to 将要访问的路径
 * from 代表从哪个路径跳转而来
 * next 是一个函数，表示放行
 *  next() 放行 next('/login') 强制跳转
 * */
    if (to.path === '/login') return next();
    const tokenStr = window.sessionStorage.getItem('token');
    if (!tokenStr) return next('/login');
    next();
});

export default router;
// // 如果用户没有登录，但是直接通过URL访问特定页面，需要重新导航到登录页面
//     // 为路由对象，添加beforeEach 导航守卫
//     router.beforeEach((to,from,next)=>{
//       // to 要访问的路径  from到那个路径 next放行函数
//       // 如果用户访问的登录页面，直接执行
//       if(to.path == '/login')return next()
//       const tokenStr = window.sessionStorage.getItem("token")
//       //  没有token，强制跳转到登录页
//       if(!tokenStr)return next('/login')
//       next()
//   })
