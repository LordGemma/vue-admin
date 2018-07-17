<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <ul class="control">
            <li class="button created is-info" @click.prevent="sendPersonId(0)">
              <router-link to="/users/create">
            <span class="icon">
              <i class="fa fa-plus" aria-hidden="true"></i>
            </span>
                <span>Create a New User</span>
              </router-link>
            </li>
          </ul>
        </article>
      </div>
    </div>
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <div class="columns">
            <div class="sorting column is-6">
              <p class="control">
                Show
                <span class="select">
                  <select v-model="selected" @change="getPageSize(selected)">
                    <option v-for="option in options" :value="option.value">{{ option.text }}</option>
                  </select>
                </span>
                entries
              </p>
            </div>
            <div class="search column is-6">
              <p class="control has-addons has-addons-right">
                <input @keyup.enter="searchCustomer" v-model="searchData" class="input" type="text" placeholder="Search">
                <a @click.prevent="searchCustomer" class="button is-info"><i class="fa fa-search" aria-hidden="true"></i></a>
              </p>
            </div>
          </div>
          <table class="table">
            <thead>
            <tr>
              <th style="width:109px;">User Name</th>
              <th style="width:107px;">First Name</th>
              <th style="width:107px;">Last Name</th>
              <th style="width:175px;">Mail</th>
              <th style="width:105px;">Phone</th>
              <th style="width:86px;">Type</th>
              <th></th>
            </tr>
            </thead>
            <tbody>
            <tr v-model="clickCallback" v-for="item in customerData">
              <td style="width:109px;">{{item.userName}}</td>
              <td style="width:107px;">{{item.firstName}}</td>
              <td style="width:107px;">{{item.lastName}}</td>
              <td style="width:175px;">{{item.userMail}}</td>
              <td style="width:105px;">{{item.userPhone}}</td>
              <td style="width:86px;">{{item.userType | capitalize}}</td>
              <td>
                <ul class="control has-addons has-addons-right">
                  <li @click.prevent="sendPersonId(item)">
                    <router-link tag="button" class="button is-info is-outlined" to="/users/edit">
                      <span class="icon">
                        <i class="fa fa-pencil" aria-hidden="true"></i>
                      </span>
                      <span>Edit</span>
                    </router-link>
                  </li>
                </ul>
              </td>
            </tr>
            </tbody>
          </table>
          <button :class="{'refresh-button': pagination > 1}" class="button is-info is-outlined" @click="refreshData()">
                      <span class="icon">
                        <i class="fa fa-refresh" aria-hidden="true"></i>
                      </span>
            <span>Refresh</span>
          </button>
          <paginate v-if="pagination > 1" v-model="pagination"
                    :page-count="pagination"
                    :page-range="3"
                    :initial-page="0"
                    :margin-pages="2"
                    :prev-text="'Prev'"
                    :next-text="'Next'"
                    :click-handler="clickCallback"
                    :container-class="'pagination has-addons control'"
                    :page-link-class="'page-item button is-info is-outlined'"
                    :next-link-class="'button is-info is-outlined'"
                    :prev-link-class="'button is-info is-outlined'">
          </paginate>
        </article>
      </div>
    </div>

  </div>
</template>

<script>
  import Axios from 'axios'
  import { mapGetters, mapActions } from 'vuex'
  import Paginate from 'vuejs-paginate'
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
      Paginate,
      Message
    },
    data () {
      return {
        config: {headers: {'Content-type': 'application/json', 'Token-Key': this.token}},
        searchData: '',
        customerData: '',
        selected: 5,
        currentPage: 1,
        options: [
          { text: '5', value: '5' },
          { text: '10', value: '10' },
          { text: '20', value: '20' }
        ],
        pagination: 1,
        sessionToken: this.token
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
      console.log(this.token)
      this.getPageSize(this.selected)
      this.sessionToken = this.token
    },
    watch: {
      sessionToken () {
        this.sessionToken = this.token
      }
    },
    computed: {
      ...mapGetters({ baseUrl: 'getBaseUrl', loader: 'getLoaderState', token: 'getTokenKey', errorMessage: 'getErrorMessage', statusWindow: 'getStatusWindow' })
    },
    methods: {
      ...mapActions(['mutateLoaderState', 'mutateMessageState']),
      refreshData () {
        this.searchData = ''
        this.getPageSize(5)
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
      searchCustomer () {
        this.mutateLoaderState(true)
        let url = this.baseUrl + 'admin/user/search-like?all-fields=' + this.searchData + '&page-number=' + this.currentPage
        Axios.get(url, {headers: {'Token-Key': this.token}})
          .then(response => {
            this.mutateLoaderState(false)
            this.customerData = response.data.result
            console.log(response.data.result)
          })
          .catch(e => {
            console.log(e)
            this.mutateLoaderState(false)
            this.openMessageWithType(e)
          })
      },
      clickCallback (pageNum) {
        if (pageNum === undefined) {
          this.currentPage = 1
        } else {
          this.currentPage = pageNum
        }
        this.getPageSize(this.selected)
      },
      getPageSize (selected) {
        this.mutateLoaderState(true)
        let pageNum = this.currentPage
        this.selected = selected
        let pageSize = this.selected.toString()
        let url = this.baseUrl + 'admin/user/list?page-number=' + pageNum + '&page-size=' + pageSize
        Axios.get(url, {headers: {'Token-Key': this.token}})
          .then(response => {
            this.mutateLoaderState(false)
            this.$store.commit('modalVisible', false)
            this.customerData = response.data.result
            this.pagination = parseInt(response.data.countPage)
          })
          .catch(e => {
            console.log(e)
            this.mutateLoaderState(false)
            this.openMessageWithType(e)
          })
      },
      sendPersonId (item) {
        this.$store.commit('customerId', item.userId)
        this.$session.start()
        this.$session.set('sessionUserId', item.userId)
      }
    }
  }
</script>

<style lang="scss">
  .table-responsive {
    display: block;
    width: 100%;
    min-height: .01%;
    overflow-x: auto;
  }
  ul.control {
    li.created {
      a {
        color: #ffffff;
      }
    }
    li.button:hover {
      a{
        color: #fff;
      }
    }
  }

  .pagination {
    margin-top: 40px;
    .active {
      a.button.is-info.is-outlined {
        background-color: #0080ff;
        border-color: transparent;
        color: #fff;
      }
    }
  }
</style>
