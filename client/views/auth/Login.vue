<template >
  <div class="content login-wrap">
    <div class="columns is-vcentered">
      <div class="column is-4 is-offset-4">
        <div class="box login-form">
          <div class="has-text-centered logo-login">
            <img src="~assets/logo.png" alt="Accuware">
          </div>
          <form v-on:submit.prevent="sendClientData">
            <label class="label">User Name</label>
            <p class="control has-icon has-icon-right">
              <input @click="mutateLoginMessage(false)" :class="{ redInput: loginMessage }" v-model="body.username" class="input" type="text" placeholder="Your User Name">
              <span v-show="loginMessage" class="icon is-small">
                <i :class="{ redText: loginMessage }" class="fa fa-warning"></i>
              </span>
            </p>
            <label class="label">Password</label>
            <p class="control has-icon has-icon-right">
              <input @click="mutateLoginMessage(false)" :class="{ redInput: loginMessage }" v-model="body.password" class="input" type="password" placeholder="Your Password">
              <span v-show="loginMessage" class="icon is-small">
                <i :class="{ redText: loginMessage }" class="fa fa-warning"></i>
              </span>
            </p>

            <p v-show="loginMessage" class="errorBlock redText has-text-centered">{{ errorMessage }}</p>

            <hr>
            <p class="control has-text-centered">
              <button type="submit" class="button is-dark">Sign Up</button>
            </p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Axios from 'axios'
//  import Vue from 'vue'
  import { mapActions, mapGetters } from 'vuex'
//  import Message from 'vue-bulma-message'
//
//  const MessageComponent = Vue.extend(Message)
//
//  const openMessage = (
//    propsData = {
//      title: '',
//      message: '',
//      type: '',
//      direction: '',
//      duration: 2000,
//      container: '.messages'
//    }) => {
//    return new MessageComponent({
//      el: document.createElement('div'),
//      propsData
//    })
//  }

  export default {
    components: {
      Axios
//      Message
    },
    data () {
      return {
        body: {
          username: null,
          password: null
        },
        error: null
      }
    },
    mounted () {
      document.body.appendChild(this.$el)
    },
    computed: {
      ...mapGetters({ baseUrl: 'getBaseUrl', errorMessage: 'getErrorMessage', statusWindow: 'getStatusWindow', loader: 'getLoaderState', loginMessage: 'getLoginMessage' })
    },
    methods: {
      ...mapActions(['mutateLoaderState', 'mutateLoginMessage', 'mutateUserName']),
      sendClientData () {
        let url = this.baseUrl + 'admin/session/sign-in?user-name=' + this.body.username + '&user-pass=' + this.body.password
        Axios.get(url)
          .then(response => {
            this.$ls.set('tokenKey', response.data)
            this.$ls.set('userName', this.body.username)
            this.sendToken(response.data)
            this.mutateUserName(this.body.username)
            let parser = window.location.href
            let back = parser.split('=')[1]
            if (!back) back = encodeURIComponent(window.btoa('/home'))
            let url = window.atob(decodeURIComponent(back))
            this.$router.push(url)
            this.mutateLoginMessage(false)
          })
          .catch(e => {
            console.log(e)
            console.log(this.errorMessage)
            this.mutateLoginMessage({status: true, message: this.errorMessage})
            this.mutateLoaderState(false)
          })
      },
      sendToken (token) {
        this.$store.commit('getTokenKey', token)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .is-title {
    text-transform: capitalize;
  }
  .redInput {
    border: 1px solid red;
  }
  .redText {
    color: red;
    font-weight: 600;
    background-color: #fff;
  }
  .errorBlock {
    border-radius: 3px;
    padding: 5px;
  }
  .login-form {
    background-color: #017eff;
  }
  .logo-login {
    padding: 20px 0;
    margin: 0 0 15px;
    background-color: #eeeeee;
  }
</style>
