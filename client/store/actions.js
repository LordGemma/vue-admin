import * as types from './mutation-types'

export const toggleSidebar = ({ commit }, opened) => commit(types.TOGGLE_SIDEBAR, opened)

export const toggleDevice = ({ commit }, device) => commit(types.TOGGLE_DEVICE, device)

export const expandMenu = ({ commit }, menuItem) => {
  if (menuItem) {
    menuItem.expanded = menuItem.expanded || false
    commit(types.EXPAND_MENU, menuItem)
  }
}

export const switchEffect = ({ commit }, effectItem) => {
  if (effectItem) {
    commit(types.SWITCH_EFFECT, effectItem)
  }
}

export const mutateLoaderState = ({commit}, load) => {
  commit(types.MUTATE_LOADER_STATE, load)
}

export const mutateErrorsState = ({commit}, obj) => {
  commit(types.MUTATE_ERRORS_STATE, obj)
}

export const mutateMessageState = ({commit}, obj) => {
  commit(types.MUTATE_MESSAGE_STATE, obj)
}

export const mutateLoginMessage = ({commit}, status) => {
  commit(types.MUTATE_LOGIN_MESSAGE, status)
}

export const mutateUserName = ({commit}, name) => {
  commit(types.MUTATE_USER_NAME, name)
}
