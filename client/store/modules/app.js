import * as types from '../mutation-types'

const state = {
  showModal: true,
  errorMessage: '',
  statusWindow: 'success',
  userName: 'guest',
  loader_state: false,
  loginMessage: false,
  device: {
    isMobile: false,
    isTablet: false
  },
  sidebar: {
    opened: false,
    hidden: false
  },
  effect: {
    translate3d: true
  }
}

const mutations = {
  [types.TOGGLE_DEVICE] (state, device) {
    state.device.isMobile = device === 'mobile'
    state.device.isTablet = device === 'tablet'
  },

  [types.TOGGLE_SIDEBAR] (state, opened) {
    if (state.device.isMobile) {
      state.sidebar.opened = opened
    } else {
      state.sidebar.opened = true
    }
  },

  [types.SWITCH_EFFECT] (state, effectItem) {
    for (let name in effectItem) {
      state.effect[name] = effectItem[name]
    }
  },

  [types.MUTATE_LOADER_STATE] (state, load) {
    state.loader_state = load
  },

  [types.MUTATE_ERRORS_STATE] (state, obj) {
    state.showModal = obj.showModal
    state.errorMessage = obj.errorMessage
    state.statusWindow = obj.statusWindow
  },

  [types.MUTATE_LOGIN_STATE] (state, status) {
    state.showModal = status
  },

  [types.MUTATE_MESSAGE_STATE] (state, obj) {
    state.errorMessage = obj.message
    state.statusWindow = obj.status
  },

  [types.MUTATE_LOGIN_MESSAGE] (state, obj) {
    state.loginMessage = obj.status
    state.errorMessage = obj.message
  },

  [types.MUTATE_USER_NAME] (state, name) {
    state.userName = name
  }
}

export default {
  state,
  mutations
}
