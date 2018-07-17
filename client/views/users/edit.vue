<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-vertical is-12">
        <div class="tile">
          <div class="tile is-parent">
            <article class="tile is-child box">
              <ul class="control">
                <li class="button is-info is-outlined">
                  <a @click.prevent="back()">
                      <span class="icon">
                        <i class="fa fa-chevron-left" aria-hidden="true"></i>
                      </span>
                    <span>BACK</span>
                  </a>
                </li>
              </ul>
              <p class="title has-text-centered">Wizard Form</p>
              <p class="subtitle has-text-centered">Users</p>
              <div class="content">
                <article class="tile is-child">
                  <h1 class="title has-text-centered" id="createduser">Select user</h1>
                  <div class="block">
                    <div class="control is-horizontal">
                      <div class="control columns">
                        <div class="column is-8 is-offset-2">
                          <div class="select is-fullwidth">
                            <select v-model="value" @change="getSelectValue(value)">
                              <option v-for="user in users" :value="user.value">{{ user.text }}</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                    <form id="sedForm" @submit.prevent="onSubmit">
                      <div class="control is-horizontal is-centered">
                        <div class="columns tile is-12" v-model="formData" v-bind="formData">
                          <div class="column">
                            <label class="label">User Name <span class="required-star">*</span></label>
                            <div class="control has-icon has-icon-right">
                              <input name="name" v-validate="'required|min:3'" :class="{'input': true, 'is-danger': errors.has('name') }" v-model="formData.userName" :value="formData.userName" class="input" type="text" placeholder="User Name">
                              <span class="icon is-small">
                                <i v-show="errors.has('name')" class="fa fa-warning"></i>
                              </span>
                              <span v-show="errors.has('name')" class="help is-danger">{{ errors.first('name') }}</span>
                            </div>
                            <label class="label">Phone</label>
                            <div class="control has-icon has-icon-right">
                              <cleave v-model="formData.userPhone" :value="formData.userPhone" class="input" type="tel" placeholder="Phone Number" :options="{ phone: true, phoneRegionCode: 'cn' }"></cleave>
                            </div>
                            <label class="label">First Name</label>
                            <div class="control has-icon has-icon-right">
                              <input v-model="formData.firstName" :value="formData.firstName" class="input" type="text" placeholder="User First Name">
                            </div>
                            <label class="label">User Type</label>
                            <div class="control has-icon has-icon-right">
                              <div class="select is-fullwidth">
                                <select v-model="formData.userType" @change="changeUserType(formData.userType)">
                                  <option :selected="formData.userType" :value="formData.userType">{{ formData.userType | capitalize }}</option>
                                  <option :value="formData.userType === 'operator' ? 'admin' : formData.userType === 'admin' ? 'operator' : 'operator'">{{ formData.userType === 'operator' ? 'admin' : 'operator' | capitalize }}</option>
                                  <option v-if="formData.userType === 'system'" value="admin">admin</option>
                                </select>
                              </div>
                            </div>
                          </div>
                          <div class="column is-offset-1">
                            <label class="label">Password</label>
                            <div class="control">
                              <input name="password" v-model="formData.userPass" :value="formData.userPass" class="input" type="password" placeholder="User Password">
                            </div>
                            <label class="label">Email <span class="required-star">*</span></label>
                            <div class="control has-icon has-icon-right">
                              <input name="email" v-validate="'required|email'" :class="{'input': true, 'is-danger': errors.has('email') }" v-model="formData.userMail" :value="formData.userMail" class="input" type="email" placeholder="User Email">
                              <span class="icon is-small">
                              <i v-show="errors.has('email')" class="fa fa-warning"></i>
                              </span>
                              <span v-show="errors.has('email')" class="help is-danger">{{ errors.first('email') }}</span>
                            </div>
                            <label class="label">Last Name</label>
                            <div class="control has-icon has-icon-right">
                              <input v-model="formData.lastName" :value="formData.lastName" class="input" type="text" placeholder="User Last Name">
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="control save-button">
                        <button type="submit" class="button is-primary is-outlined is-medium">Save</button>
                      </div>
                    </form>
                  </div>
                </article>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
  import Axios from 'axios'
  import Cleave from 'vue-cleave'
  import 'cleave.js/dist/addons/cleave-phone.cn'
  import { mapMutations, mapGetters, mapActions } from 'vuex'
  import Vue from 'vue'
  import Message from 'vue-bulma-message'

  const MessageComponent = Vue.extend(Message)

  const openMessage = (
    propsData = {
      status: undefined,
      title: '',
      message: '',
      type: '',
      direction: '',
      duration: 2000,
      container: '.messages'
    }) => {
    if (propsData.status !== 401) {
      return new MessageComponent({
        el: document.createElement('div'),
        propsData
      })
    }
  }

  export default {
    components: {
      Axios,
      Cleave,
      Message
    },
    data () {
      return {
        personId: this.sessionUserId,
        value: '',
        userData: '',
        users: [],
        sessionUserId: null,
        formData: {
          userId: 0,
          userName: '',
          userPhone: '',
          userMail: '',
          userType: 'admin',
          userPass: null,
          firstName: '',
          lastName: ''
        }
      }
    },
    beforeCreate: function () {
      if (!this.$ls.get('tokenKey')) {
        this.$router.push('/')
      } else {
        this.$store.commit('getTokenKey', this.$ls.get('tokenKey'))
      }
    },
    created () {
      if (this.$session.has('sessionUserId')) {
        this.sessionUserId = this.$session.get('sessionUserId')
      }
      this.getSelectValue(this.sessionUserId)
      this.getAllusers()
      this.value = this.sessionUserId
    },
    computed: {
      ...mapGetters({ baseUrl: 'getBaseUrl', loader: 'getLoaderState', getPersonId: 'getCustomerId', token: 'getTokenKey', errorMessage: 'getErrorMessage', statusWindow: 'getStatusWindow' })
    },
    watch: {
      userType () {
        if (this.formData.userType === '' || this.formData.userType === undefined) {
          this.formData.userType = 'admin'
        }
      }
    },
    methods: {
      ...mapActions(['mutateLoaderState', 'mutateMessageState']),
      back () {
        this.$router.go(window.history.back())
      },
      openMessageWithType (error = undefined) {
        let status = (error && error.response && error.response.status) ? error.response.status : undefined
        openMessage({
          status: status,
          message: this.errorMessage,
          type: this.statusWindow,
          duration: 3000,
          showCloseButton: false
        })
      },
      ...mapMutations([
        'customerId'
      ]),
      changeUserType (event) {
        if (this.formData.userType === '' || this.formData.userType === undefined) {
          this.formData.userType = 'admin'
        } else {
          this.formData.userType = event
        }
      },
      onSubmit () {
        this.$validator.validateAll().then(() => {
          this.mutateLoaderState(true)
          let url
          let formData
          if (this.formData.userId === null || this.formData.userId === '') {
            url = this.baseUrl + 'admin/user/create'
            this.mutateMessageState({message: 'The user was created', status: 'success'})
            formData = {
              userName: this.formData.userName,
              userPhone: this.formData.userPhone,
              userMail: this.formData.userMail,
              userType: this.formData.userType,
              userPass: this.formData.userPass,
              firstName: this.formData.firstName,
              lastName: this.formData.lastName
            }
          } else {
            url = this.baseUrl + 'admin/user/edit'
            formData = this.formData
            this.mutateMessageState({message: 'The data of the user was updated', status: 'success'})
          }
          Axios.post(url, formData, {headers: {'Token-Key': this.token}})
            .then(response => {
              this.mutateLoaderState(false)
              this.getAllusers()
              this.openMessageWithType()
            })
            .catch(e => {
              console.log(e)
              this.mutateLoaderState(false)
              this.openMessageWithType(e)
              this.getAllusers()
            })
        }).catch(() => {
          // eslint-disable-next-line
          console.log('Correct them errors!')
        })
      },
      getAllusers () {
        this.mutateLoaderState(true)
        let url = this.baseUrl + 'admin/user/get-all'
        Axios.get(url, {headers: {'Token-Key': this.token}})
          .then(response => {
            this.mutateLoaderState(false)
            let usersData = response.data
            for (let i = 0; i < usersData.length; i++) {
              let personData = { text: usersData[i].userName, value: usersData[i].userId }
              this.users.push(personData)
            }
          })
          .catch(e => {
            console.log(e)
            this.mutateLoaderState(false)
            this.openMessageWithType(e)
          })
      },
      getSelectValue (value) {
        this.mutateLoaderState(true)
        console.log(this.sessionUserId)
        if (typeof value !== 'string') {
          let url = this.baseUrl + 'admin/user/get?user-id=' + value
          this.$session.start()
          this.$session.set('sessionUserId', value)
          Axios.get(url, {headers: {'Token-Key': this.token}})
            .then(response => {
              this.mutateLoaderState(false)
              this.formData.userId = response.data.userId
              this.formData.userName = response.data.userName
              this.formData.userPhone = response.data.userPhone
              this.formData.userMail = response.data.userMail
              this.formData.userType = response.data.userType
              this.formData.firstName = response.data.firstName
              this.formData.lastName = response.data.lastName
              console.log(response.data)
            })
            .catch(e => {
              console.log(e)
              this.mutateLoaderState(false)
              this.openMessageWithType(e)
            })
        } else {
//          this.$route.name = 'Create New User'
          this.mutateLoaderState(false)
          this.formData.userId = null
          this.formData.userName = ''
          this.formData.userPhone = null
          this.formData.userMail = ''
          this.formData.userType = 'admin'
          this.formData.userPass = null
          this.formData.firstName = ''
          this.formData.lastName = ''
        }
      }
    },
    edituserForId () {
      if (this.personId === 0) {
        return this.value
      } else {
        return this.personId
      }
    }
  }
</script>

<style lang="scss">
  input[type="checkbox"] {
    width: 20px;
    height: 20px;
  }
  .create-button {
    margin-top: 25px;
  }
  .save-button {
    margin-top: 25px;
    display: flex;
    button {
      margin: auto;
    }
  }

</style>
