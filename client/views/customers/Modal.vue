<template>
  <modal :visible="visible" @close="close">
    <transition>
      <div class="tile is-ancestor">
        <div class="tile is-parent">
          <article class="tile is-child box">
            <h4 class="title">History of customer {{ getCustomerId }}</h4>
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
                <td>{{ getDateFromSeconds(item.date) }}</td>
              </tr>
              </tbody>
            </table>
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
    props: ['customer', 'visible'],
    components: {
      Axios,
      Paginate,
      Modal,
      Message
    },
    data () {
      return {
        customerId: 0,
        historyData: '',
        historyDesc: '',
        currentPage: 1,
        historySelect: 5,
        pagination: 1
      }
    },
    beforeCreate: function () {
      if (!this.$ls.get('tokenKey')) {
        this.$router.push('/')
      } else {
        this.$store.commit('getTokenKey', this.$ls.get('tokenKey'))
      }
    },
    watch: {
      customerId (id) {
//        console.log(id)
        this.customerId = this.customer
        this.getCustomerHistory(this.customerId)
      }
    },
    computed: {
      ...mapGetters({ baseUrl: 'getBaseUrl', loader: 'getLoaderState', token: 'getTokenKey', errorMessage: 'getErrorMessage', statusWindow: 'getStatusWindow' }),
      getCustomerId () {
//        console.log(this.customerId)
        this.customerId = this.customer
        return this.customerId
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
      },
      getCustomerHistory (item) {
        this.mutateLoaderState(true)
        let url = this.baseUrl + 'admin/customer/history?page-number=' + this.currentPage + '&customer-id=' + item
        Axios.get(url, {headers: {'Token-Key': this.token}})
          .then(response => {
            this.mutateLoaderState(false)
            this.$store.commit('modalVisible', false)
            this.historyData = response.data.result
//            this.historyDesc = response.data.result.note
            console.log(this.historyData)
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
      },
      getDateFromSeconds (time) {
        let defaultDate = Moment(time).format('MM/DD/YYYY')
        return defaultDate
      }
    }
  }
</script>

<style lang="scss">
  .tile.is-ancestor:last-child {
    margin-bottom: 0;
  }
</style>
