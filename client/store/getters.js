const pkg = state => state.pkg
const app = state => state.app
const device = state => state.app.device
const sidebar = state => state.app.sidebar
const effect = state => state.app.effect
const menuitems = state => state.menu.items
const componententry = state => {
  return state.menu.items.filter(c => c.meta && c.meta.label === 'Components')[0]
}
const getCustomerId = state => state.personId
const getUserName = state => state.app.userName
const getModalVisible = state => state.app.showModal
const getTokenKey = state => state.tokenKey
const getErrorMessage = state => state.app.errorMessage
const getLoginMessage = state => state.app.loginMessage
const getStatusWindow = state => state.app.statusWindow
const getLoaderState = state => state.app.loader_state
const getComponentName = state => state.componentName
const getBaseUrl = state => state.baseUrl

export {
  pkg,
  app,
  device,
  sidebar,
  effect,
  menuitems,
  componententry,
  getCustomerId,
  getUserName,
  getModalVisible,
  getTokenKey,
  getErrorMessage,
  getStatusWindow,
  getLoaderState,
  getComponentName,
  getBaseUrl,
  getLoginMessage
}
