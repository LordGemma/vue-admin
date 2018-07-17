<template>
  <modal :visible="visible" @close="close">
    <transition>
      <div class="tile is-ancestor">
        <div class="tile is-parent">
          <article class="tile is-child box">
            <h4 class="title">History of license</h4>
            <p class="hidden">{{getlicenseId}}</p>
            <table class="table">
              <thead>
              <tr>
                <th>Action</th>
                <th>Description</th>
                <th>Directory</th>
                <th>Date</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="item in historyData">
                <td>{{item.action}}</td>
                <td>
                  <table class="table">
                    <thead>
                    <tr>
                      <th>Label</th>
                      <th>Old value</th>
                      <th>New value</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(itemDesc, key) in item.note">
                      <td>{{key}}</td>
                      <td>{{!itemDesc.oldValue ? '' : itemDesc.oldValue }}</td>
                      <td>{{!itemDesc.newValue ? '' : itemDesc.newValue }}</td>
                    </tr>
                    </tbody>
                  </table>
                </td>
                <td>{{item.directoryName}}</td>
                <td v-text="getDateFromSeconds(item.date)"></td>
              </tr>
              </tbody>
            </table>
            <paginate v-if="historyPagination > 1" v-model="historyPagination"
                      :page-count="historyPagination"
                      :page-range="3"
                      :initial-page="0"
                      :margin-pages="2"
                      :prev-text="'Prev'"
                      :next-text="'Next'"
                      :click-handler="clickCallbackLicense"
                      :container-class="'pagination has-addons control'"
                      :page-link-class="'page-item button is-info is-outlined'"
                      :next-link-class="'button is-info is-outlined'"
                      :prev-link-class="'button is-info is-outlined'">
            </paginate>
          </article>
        </div>
      </div>
    </transition>
  </modal>
</template>

<script>
  import Axios from 'axios'
  import { mapGetters, mapActions } from 'vuex'
  import Paginate from 'vuejs-paginate'
  import { Modal } from 'vue-bulma-modal'
  import Moment from '../../../node_modules/moment'
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
    props: ['license', 'visible'],
    components: {
      Axios,
      Paginate,
      Modal,
      Moment,
      Message
    },
    data () {
      return {
        historyData: '',
        currentLicensePage: 1,
        currentPage: 1,
        licenseKey: 0,
        historySelect: 5,
        historyPagination: 1,
        getCustomerId: 0
      }
    },
    watch: {
      licenseKey () {
        this.licenseKey = this.license
        let page = this.currentPage
        this.getLicenseHistory(this.licenseKey, page)
      },
      currentLicensePage () {
        this.licenseKey = this.license
        this.getLicenseHistory(this.licenseKey, this.currentLicensePage)
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
      currentLicense: {
        get: function () {
          return this.currentPage
        },
        set: function (newValue) {
          this.currentPage = this.currentLicensePage
        }
      },
      ...mapGetters({ baseUrl: 'getBaseUrl', loader: 'getLoaderState', token: 'getTokenKey', errorMessage: 'getErrorMessage', statusWindow: 'getStatusWindow' }),
      getlicenseId () {
        this.licenseKey = this.license
        return this.licenseKey
      }
    },
    methods: {
      ...mapActions(['mutateLoaderState', 'mutateMessageState']),
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
      close () {
        this.$emit('close')
        this.currentPage = 1
        this.currentLicensePage = 1
      },
      getLicenseHistory (item, page) {
        this.mutateLoaderState(true)
        let url = this.baseUrl + 'admin/license/history?page-number=' + page + '&page-size=5&license-key=' + item
        Axios.get(url, {headers: {'Token-Key': this.token}})
          .then(response => {
            this.mutateLoaderState(false)
            this.historyData = response.data.result
            this.historyPagination = parseInt(response.data.countPage)
            console.log(response.data)
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
      clickCallbackLicense (pageNum) {
        if (pageNum === undefined) {
          this.currentLicensePage = 1
        } else {
          this.currentLicensePage = pageNum
        }
        console.log(this.currentLicensePage)
      }
    }
  }
</script>

<style lang="scss">
  .tile.is-ancestor:last-child {
    margin-bottom: 0;
  }
</style>
