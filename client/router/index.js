import Vue from 'vue'
import Router from 'vue-router'
import menuModule from 'vuex-store/modules/menu'
Vue.use(Router)

export default new Router({
  mode: 'history',
  linkActiveClass: 'is-active',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      name: 'Login',
      path: '/login',
      component: require('../views/auth/Login.vue')
    },
    {
      name: 'Main',
      path: '/',
      component: require('../views/Home.vue')
    },
    {
      name: 'Create New Customer',
      path: '/customers/created',
      component: require('../views/customers/created.vue')
    },
    {
      name: 'Edit Customer',
      path: '/customers/edit',
      component: require('../views/customers/edit.vue')
    },
    {
      name: 'Edit License',
      path: '/license-list/edit',
      component: require('../views/license-list/edit.vue')
    },
    {
      name: 'Edit User',
      path: '/users/edit',
      component: require('../views/users/edit.vue')
    },
    {
      name: 'Create New User',
      path: '/users/create',
      component: require('../views/users/create.vue')
    },
    {
      name: 'Page Not Found',
      path: '*',
      component: require('../views/404/')
    },
    ...generateRoutesFromMenu(menuModule.state.items),
    {
      path: '*',
      redirect: '/'
    }
  ]
})

// Menu should have 2 levels.
function generateRoutesFromMenu (menu = [], routes = []) {
  for (let i = 0, l = menu.length; i < l; i++) {
    let item = menu[i]
    if (item.path) {
      routes.push(item)
    }
    if (!item.component) {
      generateRoutesFromMenu(item.children, routes)
    }
  }
  return routes
}
