import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "about" */ '../views/home.vue')
  },

  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "about" */ '../views/login.vue')
  },

  {
    path: '/routerChoose',
    name: 'routerChoose',
    component: () => import(/* webpackChunkName: "about" */ '../views/routerChoose.vue')
  },
  {
    path: '/energy',
    name: 'energy',
    component: () => import(/* webpackChunkName: "about" */ '../views/energy.vue')
  },
  {
    path: '/manual',
    name: 'manual',
    component: () => import(/* webpackChunkName: "about" */ '../views/manual.vue')
  },
  {
    path: '/conPic',
    name: 'conPic',
    component: () => import(/* webpackChunkName: "about" */ '../views/conPic.vue')
  },
]
  
const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

//挂载路由导航守工
router.beforeEach((to, form, next) => {
  //to将要访问的路名
  // form从哪个路径跳转来
  // next放行
  if (to.path === '/login')
   return next()

   const tokenstr = window.sessionStorage.getItem('username')
   console.log("tokenstr",tokenstr)
   if (!tokenstr) return next('./login')
   next()
  })

export default router
