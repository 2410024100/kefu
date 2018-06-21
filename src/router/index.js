import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Siliao from '@/components/siliao'
import Home from '@/components/Home'
import Kan from '@/components/kan'

Vue.use(Router)
//设置成history模式后，下面的/web 表示自己服务器项目的目录名


export default new Router({
  mode: 'history',
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: to.meta.savedPosition };
  },  //记录滚动位置

  routes: [
    {
      path: '/web',
      name: 'HelloWorld',
      component: HelloWorld,
      meta: { keepAlive: true }

    },
    {
      path: '/web/siliao.xml',
      name: 'Siliao',
      component: Siliao,
      meta: {
        keepAlive: false // 不需要缓存
      }
    },
    {
      path: '/web/home.xml',
      name: 'Home',
      component: Home,
      meta: {
        keepAlive: false // 不需要缓存
      }
    },
    {
      path: '/web/kan.xml',
      name: 'kan',
      component: Kan,
      meta: {
        keepAlive: false // 不需要缓存
      }
    }

  ]
})
