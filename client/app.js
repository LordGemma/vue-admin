import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import NProgress from 'vue-nprogress'
import { sync } from 'vuex-router-sync'
import App from './App.vue'
import router from './router'
import store from './store'
import * as filters from './filters'
import VueResource from 'vue-resource'
import { TOGGLE_SIDEBAR, MUTATE_ERRORS_STATE, MUTATE_LOGIN_STATE, MUTATE_LOGIN_MESSAGE } from 'vuex-store/mutation-types'
import VeeValidate from 'vee-validate'
import VueLocalStorage from 'vue-ls'
import VueFlatpickr from 'vue-flatpickr'
import VueSession from 'vue-session'

const options = {
  router: false,
  http: false
}

Vue.use(VueFlatpickr)
Vue.prototype.$http = axios
Vue.use(NProgress, options)
Vue.use(Vuex)
Vue.router = router
Vue.use(VeeValidate)
Vue.use(VueResource)
Vue.use(VueLocalStorage)
Vue.use(VueSession)

window.jQuery = window.$ = require('jquery')

// Enable devtools
Vue.config.devtools = true
sync(store, router, VeeValidate)

const nprogress = new NProgress({ parent: '.nprogress-container' })

const { state } = store

axios.interceptors.response.use(
  function (response) {
    store.commit(MUTATE_LOGIN_STATE, false)
    return Promise.resolve(response)
  },
  function (error) {
    console.log(error)
    if (error.response.status === 401) {
      store.commit(MUTATE_LOGIN_MESSAGE, {status: true, message: error.response.data.error})
      let messageBlock = document.getElementById('app')

      console.log(messageBlock)
      store.commit('getTokenKey', 0)
      if (window.location.pathname !== '/') {
        let separator = (window.location.href.indexOf('?') === -1) ? '?' : '&'
        router.push('/' + separator + 'back=' + encodeURIComponent(window.btoa(window.location.pathname)))
      }
      console.log(error.response)
    } else if (error.response.status === 404) {
      console.log(error.response)
      store.commit(MUTATE_ERRORS_STATE, {showModal: false, errorMessage: error.response.data.error, statusWindow: 'danger'})
      router.push('/404')
    } else {
      console.log(error.response)
      store.commit(MUTATE_ERRORS_STATE, {showModal: false, errorMessage: error.response.data.error, statusWindow: 'danger'})
    }

    return Promise.reject(error)
  })

router.beforeEach((route, redirect, next) => {
  if (state.app.device.isMobile && state.app.sidebar.opened) {
    store.commit(TOGGLE_SIDEBAR, false)
  }
  next()
})

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

const app = new Vue({
  router,
  store,
  VeeValidate,
  nprogress,
  ...App
})

export { app, router, store, VeeValidate }
