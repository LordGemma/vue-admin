<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <div class="columns">
            <div class="sorting column is-6">
              <p class="control">
                Show
                <span class="select">
                  <select v-model="selected" @change="getAllLicense(selected)">
                    <option v-for="option in options" :value="option.value">{{ option.text }}</option>
                  </select>
                </span>
                entries
              </p>
            </div>
            <div class="search column is-6">
              <p class="control has-addons has-addons-right">
                <input @keyup.enter="getAllLicense(selected)" v-model="searchData" class="input" type="text" placeholder="Search">
                <a @click.prevent="getAllLicense(selected)" class="button is-info"><i class="fa fa-search" aria-hidden="true"></i></a>
              </p>
            </div>
          </div>
          <table class="table">
            <thead>
            <tr>
              <th style="width:109px;">Customer ID</th>
              <th style="width:65px;">Status</th>
              <th style="width:131px;">Expiration Date</th>
              <th style="width:150px;">Expiration Time</th>
              <th style="overflow: hidden;" width="250">Description</th>
              <th style="width:170px;">Key</th>
              <th></th>
            </tr>
            </thead>
            <tbody>
            <tr class="is-multiline is-mobile" v-model="clickLicenseCallback" v-for="item in licenseData">
              <td style="width:109px;">{{item.customerId}}</td>
              <td style="width:65px;">{{item.licenseStatus  | capitalize}}</td>
              <td style="width:131px;" class="is-icon" v-text="getDateFromSeconds(item.licenseExpirationDate)"></td>
              <td style="width:150px;" class="is-icon" v-text="updateRemainingTime(item.licenseExpirationTime)"></td>
              <td style="width: 250px;" width="250" class="is-icon desc-col">
                <tooltip :label="item.licenseNote" placement="bottom" type="info" size="large" :rounded="true">
                  <p style="padding:0 0.75em 0 0;">
                    <span style="display: inline-block; max-width: 180px; overflow: hidden;">{{item.licenseNote}}</span>
                  </p>
                </tooltip>
              </td>
              <td style="width:170px;">{{item.licenseKey}}</td>
              <td>
                <ul class="control has-addons has-addons-right">
                  <li @click.prevent="sendPersonId(item.customerId)">
                    <router-link tag="button" class="button is-info is-outlined" to="/license-list/edit">
                    <span class="icon">
                      <i class="fa fa-pencil" aria-hidden="true"></i>
                    </span>
                      <span>Edit</span>
                    </router-link>
                  </li>
                  <li @click.prevent="sendPersonId(item.customerId)">
                    <router-link tag="button" class="button is-info is-outlined" to="/customers/edit">
                    <span class="icon">
                      <i class="fa fa-folder-open" aria-hidden="true"></i>
                    </span>
                      <span>To Customer</span>
                    </router-link>
                  </li>
                  <li class="button is-info is-outlined modal-button" @click="openModalLicense(item.licenseKey)">
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
          <button class="button is-info is-outlined refresh-button" @click="refreshData()">
                      <span class="icon">
                        <i class="fa fa-refresh" aria-hidden="true"></i>
                      </span>
            <span>Refresh</span>
          </button>
          <paginate v-model="licensePagination"
                    :page-count="licensePagination"
                    :page-range="3"
                    :initial-page="0"
                    :margin-pages="2"
                    :prev-text="'Prev'"
                    :next-text="'Next'"
                    :click-handler="clickLicenseCallback"
                    :container-class="'pagination has-addons control'"
                    :page-link-class="'page-item button is-info is-outlined'"
                    :next-link-class="'button is-info is-outlined'"
                    :prev-link-class="'button is-info is-outlined'">
          </paginate>
        </article>
        <license :visible="showModalLicense" @close="closeModalLicense" :license="setLicenseId"></license>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Axios from 'axios'
  import { mapGetters, mapActions } from 'vuex'
  import Paginate from 'vuejs-paginate'
  import License from './License.vue'
  import Moment from '../../../node_modules/moment'
  import Message from 'vue-bulma-message'
  import Tooltip from 'vue-bulma-tooltip'

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
      License,
      Moment,
      Message,
      Tooltip
    },
    data () {
      return {
        searchData: '',
        licenseData: '',
        selected: 5,
        options: [
          { text: '5', value: '5' },
          { text: '10', value: '10' },
          { text: '20', value: '20' }
        ],
        currentPage: 1,
        licensePagination: 1,
        licenseKey: 0,
        showModalLicense: false,
        setLicenseId: 0,
        remainingTime: null,
        loading: false
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
      this.getAllLicense(5)
    },
    computed: {
      ...mapGetters({ baseUrl: 'getBaseUrl', loader: 'getLoaderState', token: 'getTokenKey', errorMessage: 'getErrorMessage', statusWindow: 'getStatusWindow' })
    },
    methods: {
      ...mapActions(['mutateLoaderState', 'mutateMessageState']),
      refreshData () {
        this.searchData = ''
        this.getAllLicense(this.selected)
        this.loading = true
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
      clickLicenseCallback (pageNum) {
        if (pageNum === undefined) {
          this.currentPage = 1
        } else {
          this.currentPage = pageNum
        }
        this.getAllLicense(this.selected)
      },
      getAllLicense (selected) {
        this.mutateLoaderState(true)
        let pageNum = this.currentPage
        this.selected = selected
        let pageSize = this.selected.toString()
        let url = this.baseUrl + 'admin/license/search-like?all-fields=' + this.searchData + '&page-number=' + pageNum + '&page-size=' + pageSize
        Axios.get(url, {headers: {'Token-Key': this.token}})
          .then(response => {
            this.mutateLoaderState(false)
            this.loading = false
            this.licenseData = response.data.result
            this.licensePagination = response.data.countPage
          })
          .catch(e => {
            console.log(e)
            this.mutateLoaderState(false)
            this.openMessageWithType(e)
          })
      },
      getDateFromSeconds (time) {
        let defaultDate = Moment(time).format('MM/DD/YYYY')
        return defaultDate
      },
      updateRemainingTime (time) {
        let timeNow = Moment.duration(time)
        timeNow = timeNow._data.months + 'm/' + timeNow._data.days + 'd ' + timeNow._data.hours + ':' + timeNow._data.minutes + ':' + timeNow._data.seconds
        this.remainingTime = timeNow
        return timeNow
      },
      sendPersonId (item) {
        this.$store.commit('customerId', item)
        this.$session.start()
        this.$session.set('sessionUserId', item)
      },
      openModalLicense (license) {
        this.setLicenseId = license
        this.showModalLicense = true
      },
      closeModalLicense () {
        this.showModalLicense = false
      }
    }
  }
</script>

<style lang="scss">
  .desc-col {
    max-width: 150px;
  }
  .table-responsive {
    display: block;
    width: 100%;
    min-height: .01%;
    overflow-x: auto;
  }
  ul.control {
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

  [class*="tooltip--"] {
    display: inline-block;
  }

  .tooltip {
    display: table-cell;
    position: relative;
  }

</style>
