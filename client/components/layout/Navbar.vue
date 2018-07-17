<template>
  <section class="hero is-bold app-navbar animated" :class="{ slideInDown: show, slideOutDown: !show }">
    <div class="hero-head">
      <nav class="nav">
        <div class="nav-left">
          <a class="nav-item is-hidden-tablet" @click="toggleSidebar(!sidebar.opened)">
            <i class="fa fa-bars" aria-hidden="true"></i>
          </a>
        </div>
        <div class="nav-center">
          <a class="nav-item hero-brand" @click.prevent="home">
            <img src="~assets/logo.png" :alt="pkginfo.description">
          </a>
        </div>
        <div class="nav-right is-flex nav-menu">
          <figure class="image logo-man is-24x24 is-right-5"><img class="is-circle" src="../../assets/man.png"></figure>
          <span class="username">{{ userName() }}</span>
          <a class="button" @click.prevent="logout">
            <span class="icon">
              <i class="fa fa-power-off" aria-hidden="true"></i>
            </span>
            <span>Logout</span>
          </a>
        </div>
      </nav>
    </div>
  </section>
</template>

<script>
  import Tooltip from 'vue-bulma-tooltip'
  import { mapGetters, mapActions } from 'vuex'

  export default {

    components: {
      Tooltip
    },

    props: {
      show: Boolean
    },

    computed: mapGetters({
      pkginfo: 'pkg',
      sidebar: 'sidebar'
    }),

    methods: {
      userName () {
        let username = 'guest'
        if (this.$ls.get('userName')) {
          this.mutateUserName(this.$ls.get('userName'))
          username = this.$ls.get('userName')
        }
        return username
      },
      home () {
        return this.$router.push('/home')
      },
      ...mapActions([
        'toggleSidebar',
        'mutateUserName'
      ]),
      logout () {
        let separator = (window.location.href.indexOf('?') === -1) ? '?' : '&'
        this.$ls.clear()
        this.$store.commit('getTokenKey', 0)
        this.$router.push('/' + separator + 'back=' + encodeURIComponent(window.btoa(window.location.pathname)))
        this.mutateUserName('guest')
        this.$session.destroy()
      }
    }
  }
</script>

<style lang="scss">
  @import '~bulma/sass/utilities/variables';

  .app-navbar {
    position: fixed;
    min-width: 100%;
    z-index: 1024;
    box-shadow: 0 2px 3px rgba(17, 17, 17, 0.1), 0 0 0 1px rgba(17, 17, 17, 0.1);

    .container {
      margin: auto 10px;
    }

    .nav-right {
      align-items: stretch;
      align-items: stretch;
      flex: 1;
      justify-content: flex-end;
      overflow: hidden;
      overflow-x: auto;
      white-space: nowrap;
    }
  }
  .nav-right.nav-menu {
    align-content: center;
    align-items: center;
    margin-right: 15px;
  }
  .image.logo-man {
    background-color: #0080ff;
    padding: 5px;
    border-radius: 50%;
    margin-right: 10px;
  }

  .hero-brand {
    .vue {
      margin-left: 10px;
      color: #017eff;
    }
    .admin {
      color: #28374B;
    }
  }
  .username {
    margin-right: 10px;
  }
</style>
