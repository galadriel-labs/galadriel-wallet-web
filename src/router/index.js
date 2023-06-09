import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;

Vue.use(Router)

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  { path: '/home', component: () => import('@/views/homePage/index'), hidden: true },
  { path: '/creat', component: () => import('@/views/creat/index'), hidden: true },
  { path: '/loading', component: () => import('@/views/creat/loading'), hidden: true },
  { path: '/wallet', component: () => import('@/views/wallet/index'), hidden: true },
  { path: '/audit', component: () => import('@/views/audit/index'), hidden: true },
  // { path: '/galadriel-eth', component: () => import('@/views/pgcETH/index'), hidden: true },
  // { path: '/auditability', component: () => import('@/views/auditability/index'), hidden: true },
  // { path: '/confidential', component: () => import('@/views/confidential/index'), hidden: true },
  // { path: '/technology', component: () => import('@/views/technology/index'), hidden: true },
  { path: '/', redirect: '/home', hidden: true },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  mode: 'history', // 后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

