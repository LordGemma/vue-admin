<template>
  <div class="customer-block">
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <ul class="control">
            <li class="button created is-info" @click.prevent="sendPersonId(0)">
              <router-link to="/customers/created">
            <span class="icon">
              <i class="fa fa-plus" aria-hidden="true"></i>
            </span>
                <span>Create a New Customer</span>
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
                <input @keyup.enter="getPageSize(selected)" v-model="searchData" class="input" type="text" placeholder="Search">
                <a @click.prevent="getPageSize(selected)" class="button is-info"><i class="fa fa-search" aria-hidden="true"></i></a>
              </p>
            </div>
          </div>
          <div>
            <table class="table">
              <thead>
              <tr>
                <th style="width: 102px;">Customer ID</th>
                <th style="width: 140px;">Name</th>
                <th style="width: 250px;">Address</th>
                <th style="width: 105px;">Phone</th>
                <th style="width: 175px;">Mail</th>
                <th style="width: 80px;">Type</th>
                <th></th>
              </tr>
              </thead>
              <tbody>
              <tr v-model="clickCallback" v-for="item in customerData">
                <td style="width: 102px;">{{ item.customerId }}</td>
                <td style="width: 90px;">{{item.customerName}}</td>
                <td style="width: 250px;">{{item.customerAddress}}</td>
                <td style="width: 105px;" class="is-icon">
                  {{item.customerPhone}}
               </td>
                <td style="width: 175px;" class="is-icon">
                  {{item.customerMail}}
              </td>
                <td style="width: 80px;">{{item.customerType | capitalize}}</td>
                <td>
                  <ul class="control has-addons has-addons-right">
                    <li @click.prevent="sendPersonId(item.customerId)">
                      <router-link tag="button" class="button is-info is-outlined" to="/customers/edit/">
                      <span class="icon">
                        <i class="fa fa-pencil" aria-hidden="true"></i>
                      </span>
                        <span>Edit</span>
                      </router-link>
                    </li>
                    <li @click.prevent="sendPersonId(item.customerId)">
                      <router-link tag="button" class="button is-info is-outlined" to="/license-list/edit/">
                    <span class="icon">
                      <i class="fa fa-folder-open" aria-hidden="true"></i>
                    </span>
                        <span>To License</span>
                      </router-link>
                    </li>
                    <li class="button is-info is-outlined modal-button" @click="openModalBasic(item.customerId)">
                      <span class="icon">
                        <i class="fa fa-history" aria-hidden="true"></i>
                      </span>
                      <span>History</span>
                    </li>
                  </ul>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
          <button class="button is-info is-outlined refresh-button" @click="refreshData()">
                      <span class="icon">
                        <i class="fa fa-refresh" aria-hidden="true"></i>
                      </span>
            <span>Refresh</span>
          </button>
          <paginate v-model="pagination"
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
    <modal :visible="showModal" @close="closeModalBasic" :customer="setCustomerId"></modal>
  </div>
</template>

<script>
  import Axios from 'axios'
  import Paginate from 'vuejs-paginate'
  import Modal from './Modal.vue'
  import GridLoader from 'vue-spinner/src/GridLoader.vue'
  import { mapGetters, mapActions } from 'vuex'
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
      Modal,
      GridLoader,
      Message
    },
    data () {
      return {
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
        showModal: false,
        setCustomerId: 0
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
      this.getPageSize(5)
    },
    computed: {
      ...mapGetters({ baseUrl: 'getBaseUrl', loader: 'getLoaderState', token: 'getTokenKey', errorMessage: 'getErrorMessage', statusWindow: 'getStatusWindow' })
    },
    methods: {
      ...mapActions(['mutateLoaderState', 'mutateMessageState']),
      refreshData () {
        this.searchData = ''
        this.getPageSize(this.selected)
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
        let url = this.baseUrl + 'admin/customer/search-like?all-fields=' + this.searchData + '&page-number=' + pageNum + '&page-size=' + pageSize
        Axios.get(url, {headers: {'Token-Key': this.token}})
          .then(response => {
            this.mutateLoaderState(false)
            this.customerData = response.data.result
            this.pagination = parseInt(response.data.countPage)
          })
          .catch(e => {
            this.mutateLoaderState(false)
            console.log(e)
            this.openMessageWithType(e)
          })
      },
      sendPersonId (item) {
        this.$store.commit('customerId', item)
        this.$session.start()
        this.$session.set('sessionUserId', item)
      },
      openModalBasic (id) {
        this.setCustomerId = id
        this.showModal = true
      },
      closeModalBasic () {
        this.showModal = false
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
  .modal-content, .modal-card {
    overflow: visible;
  }
  @media screen and (min-width: 769px) {
    .modal-content, .modal-card {
      width: 100%;
    }
  }
  .table td, .table th {
    vertical-align: middle;
  }
</style>
