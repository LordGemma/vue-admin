<template>
  <div class="content has-text-centered">
    <login v-show="showModal"></login>
    <p>
      <img width="200" src="~assets/logo.png" alt="Accuware">
    </p>

    <h1 class="is-title is-bold">Accuware</h1>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import Login from './auth/Login.vue'

  export default {
    components: {
      Login
    },
    data () {
      return this.$store.state.pkg
    },
    beforeMount () {
      this.mutateErrorsState({
        showModal: true,
        errorMessage: this.errorMessage,
        statusWindow: 'danger'
      })
    },
    computed: {
      ...mapGetters({
        showModal: 'getModalVisible', errorMessage: 'getErrorMessage'
      })
    },
    methods: {
      closeModalBasic () {
        this.showWindow = false
      },
      ...mapActions(['mutateLoaderState', 'mutateErrorsState'])
    }

  }
</script>

<style lang="scss" scoped>
  .is-title {
    text-transform: capitalize;
  }
  .login-wrap {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2000;
    width: 100%;
    height: 100%;
    padding-top: 15%;
    background-color: #eeeeee;

  }
  .hidden {
    display: none;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }
  .fade-enter, .fade-leave-active {
    opacity: 0
  }
</style>
