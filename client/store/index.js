import Vue from 'vue'
import Vuex from 'vuex'
import pkg from 'package'
import * as actions from './actions'
import * as getters from './getters'

import app from './modules/app'
import menu from './modules/menu'

Vue.use(Vuex)

const store = new Vuex.Store({
  strict: true,
  actions,
  getters,
  modules: {
    app,
    menu
  },
  state: {
    pkg,
    personId: 0,
    tokenKey: 0,
    componentName: '',
    baseUrl: 'http://216.117.130.194:8083/'
  },
  mutations: {
    customerId (state, id) {
      state.personId = id
    },
    getTokenKey (state, token) {
      state.tokenKey = token
    },
    modalVisible (state, visible) {
      state.showModal = visible
    }
  }
})

export default store
