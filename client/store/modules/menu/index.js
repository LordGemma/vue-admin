import * as types from '../../mutation-types'
import lazyLoading from './lazyLoading'

const state = {
  items: [
    {
      name: 'Home',
      path: '/home',
      meta: {
        icon: 'fa-home',
        link: 'home/index.vue'
      },
      component: lazyLoading('home', true)
    },
    {
      name: 'Customers',
      path: '/customers',
      meta: {
        icon: 'fa-comments-o',
        link: 'customers/index.vue'
      },
      component: lazyLoading('customers', true)
    },
    {
      name: 'License List',
      path: '/license-list',
      meta: {
        icon: 'fa-folder-open',
        link: 'license-list/index.vue'
      },
      component: lazyLoading('license-list', true)
    },
    {
      name: 'Users',
      path: '/users',
      meta: {
        icon: 'fa-users',
        link: 'users/index.vue'
      },
      component: lazyLoading('users', true)
    }
  ]
}

const mutations = {
  [types.EXPAND_MENU] (state, menuItem) {
    if (menuItem.index > -1) {
      if (state.items[menuItem.index] && state.items[menuItem.index].meta) {
        state.items[menuItem.index].meta.expanded = menuItem.expanded
      }
    } else if (menuItem.item && 'expanded' in menuItem.item.meta) {
      menuItem.item.meta.expanded = menuItem.expanded
    }
  }
}

export default {
  state,
  mutations
}
