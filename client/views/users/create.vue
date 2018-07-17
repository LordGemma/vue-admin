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
                  <h1 class="title has-text-centered" id="createduser">Create user</h1>
                  <div class="block">
                    <!--<div class="control is-horizontal">-->
                    <!--<div class="control columns">-->
                    <!--<div class="column is-8 is-offset-2">-->
                    <!--<div class="select is-fullwidth">-->
                    <!--<select v-model="value" @change="getSelectValue(value)">-->
                    <!--<option v-for="user in users" :value="user.value">{{ user.text }}</option>-->
                    <!--</select>-->
                    <!--</div>-->
                    <!--</div>-->
                    <!--</div>-->
                    <!--</div>-->
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
                            <label class="label">First Name</label>
                            <div class="control has-icon has-icon-right">
                              <input v-model="formData.firstName" :value="formData.firstName" class="input" type="text" placeholder="User First Name">
                            </div>
                            <label class="label">Phone</label>
                            <div class="control has-icon has-icon-right">
                              <cleave v-model="formData.userPhone" :value="formData.userPhone" class="input" type="tel" placeholder="Phone Number" :options="{ phone: true, phoneRegionCode: 'cn' }"></cleave>
                            </div>
                            <label class="label">Password <span class="required-star">*</span></label>
                            <div class="control has-icon has-icon-right">
                              <input name="password" v-validate="'required|min:6'" v-model="formData.userPass" :class="{'input': true, 'is-danger': errors.has('password') }" :value="formData.userPass" class="input" type="password" placeholder="User Password">
                              <span class="icon is-small">
                                <i v-show="errors.has('password')" class="fa fa-warning"></i>
                              </span>
                              <span v-show="errors.has('password')" class="help is-danger">{{ errors.first('password') }}</span>
                            </div>
                          </div>
                          <div class="column is-offset-1">
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
                            <label class="label">User Type</label>
                            <div class="control has-icon has-icon-right">
                              <div class="select is-fullwidth">
                                <select v-model="formData.userType" @change="changeUserType(formData.userType)">
                                  <option value="admin">Admin</option>
                                  <option value="operator">Operator</option>
                                  <option value="system">System</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="control has-addons has-addons-centered create-button">
                        <button type="submit" class="button is-primary is-outlined is-medium">Create</button>
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
    computed: {
      ...mapGetters({ baseUrl: 'getBaseUrl', loader: 'getLoaderState', getPersonId: 'getCustomerId', token: 'getTokenKey', errorMessage: 'getErrorMessage', statusWindow: 'getStatusWindow' })
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
        console.log(event, this.formData.userType)
      },
      onSubmit () {
        this.$validator.validateAll().then(() => {
          this.mutateLoaderState(true)
          let url
          let formData
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
          console.log(this.formData)
          Axios.post(url, formData, {headers: {'Token-Key': this.token}})
            .then(response => {
              this.mutateLoaderState(false)
              this.openMessageWithType()
              document.getElementById('sedForm').reset()
            })
            .catch(e => {
              console.log(e)
              this.mutateLoaderState(false)
              this.openMessageWithType(e)
            })
        }).catch(() => {
          // eslint-disable-next-line
          console.log('Correct them errors!')
        })
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
