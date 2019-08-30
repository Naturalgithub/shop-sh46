import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Index from './components/Index.vue'
import Users from './components/Users.vue'
import Roles from './components/Roles.vue'
import Rights from './components/Rights.vue'

Vue.use(Router)
const router = new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      name: 'index',
      component: Index,
      children: [
        { path: '/users', name: 'user', component: Users },
        { path: '/roles', name: 'roles', component: Roles },
        { path: '/rights', name: 'rights', component: Rights }
      ]
    }
  ]
})
router.beforeEach((to, from, next) => {
  // console.log(to)
  // console.log(from)
  // console.log(next)

  const token = localStorage.getItem('token')
  if (to.path === '/login' || token) {
    next()
  } else {
    next('/login')
  }
})
// 解决 vue-router 版本更新小bug(不用记)
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
export default router
