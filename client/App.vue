<template>
  <div id="app">
    <nprogress-container></nprogress-container>
    <transition mode="out-in"
                enter-active-class="fadeIn"
                leave-active-class="fadeOut"
                appear>
      <div :class="{ hidden: !loader }" class="preload-container animated">
        <clip-loader :loading="loader" color="#fff"></clip-loader>
      </div>
    </transition>
    <navbar :show="true"></navbar>
    <sidebar :show="sidebar.opened && !sidebar.hidden"></sidebar>
    <app-main></app-main>
    <footer-bar></footer-bar>
  </div>
</template>

<script>
  import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
  import NprogressContainer from 'vue-nprogress/src/NprogressContainer'
  import { Navbar, Sidebar, AppMain, FooterBar } from 'components/layout/'
  import { mapGetters, mapActions } from 'vuex'
  import Login from './views/auth/Login.vue'

  export default {
    components: {
      Navbar,
      Sidebar,
      AppMain,
      FooterBar,
      NprogressContainer,
      ClipLoader,
      Login
    },
    data () {
      return {
        loading: true,
        showWindow: true
      }
    },
    beforeMount () {
      const { body } = document
      const WIDTH = 768
      const RATIO = 3

      const handler = () => {
        if (!document.hidden) {
          let rect = body.getBoundingClientRect()
          let isMobile = rect.width - RATIO < WIDTH
          this.toggleDevice(isMobile ? 'mobile' : 'other')
          this.toggleSidebar(!isMobile)
        }
      }

      document.addEventListener('visibilitychange', handler)
      window.addEventListener('DOMContentLoaded', handler)
      window.addEventListener('resize', handler)
    },
    computed: {
      ...mapGetters({
        sidebar: 'sidebar',
        loader: 'getLoaderState'
      })
    },

    methods: {
      closeModalBasic () {
        this.showWindow = false
      },
      ...mapActions(['toggleDevice', 'toggleSidebar', 'mutateLoaderState'])
    }
  }
</script>

<style lang="scss">
  @import '~animate.css';
  .animated {
    animation-duration: .377s;
  }

  @import '~bulma';

  @import '~wysiwyg.css/wysiwyg.sass';

  $fa-font-path: '~font-awesome/fonts/';
  @import '~font-awesome/scss/font-awesome';

  html {
    background-color: whitesmoke;
  }
  $blue: hsl(217, 71%,  53%) !default
  $primary: $blue !default
  a {
    color: #3273dc;
  }

  [v-cloak] {
    display: none;
  }
  .modal-content, .modal-card {
    overflow-y: auto!important;
    overflow-x: hidden!important;
  }

  .preload-container {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
  }
  .v-spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50% -50%);
  }

  .nprogress-container {
    position: fixed !important;
    width: 100%;
    height: 100%;
    z-index: 2048;
    pointer-events: none;

    #nprogress {
      $color: #3273dc;

      .bar {
        background: $color;
      }
      .peg {
        box-shadow: 0 0 10px $color, 0 0 5px $color;
      }
      .spinner {
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .5);
      }

      .spinner-icon {
        border-top-color: #fff;
        border-left-color: #fff;
        top: 50%;
        left: 50%;
        width: 50px;
        height: 50px;
        transform: translate(-50% -50%);
        position: fixed;
      }
    }
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

  .refresh-button {
    position: absolute;
    bottom: 35px;
    right: 45px;
    z-index: 100;
  }
  .messages {
    top: 20%;
    .message {
      min-width: 500px;
      .message-body {
        text-align: center;
        padding: 2em;
      }
    }
  }
  /*.menu-list {*/
  /*a.is-active {*/
  /*background-color: #3273dc !important;*/
  /*}*/
  /*}*/
  /*a {*/
  /*color: #3273dc !important;*/
  /*}*/
  /*.button.is-primary.is-outlined {*/
  /*border-color: #3273dc !important;*/
  /*color: #3273dc !important;*/
  /*}*/
  /*.button.is-primary {*/
  /*background-color: #3273dc !important;*/
  /*}*/
</style>
