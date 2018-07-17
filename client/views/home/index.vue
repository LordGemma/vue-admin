<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <button class="button is-info is-outlined refresh-button-main" @click="refreshData()">
                      <span class="icon">
                        <i class="fa fa-refresh" aria-hidden="true"></i>
                      </span>
          <span>Refresh</span>
        </button>
        <p v-if="pieData"></p>
        <article class="tile is-child box">
          <div class="columns">
            <div class="column">
              <chart :type="'doughnut'" :data="chartData" :options="options"></chart>
            </div>
            <div class="column">
              <h6 class="title">Active: {{activeData}} <br> {{procActiveData}}%</h6>
            </div>
          </div>
        </article>
      </div>
      <div class="tile is-parent">
        <article class="tile is-child box">
          <div class="columns">
            <div class="column">
              <chart :type="'doughnut'" :data="chartData2" :options="options"></chart>
            </div>
            <div class="column">
              <h6 class="title">Trial: {{trialData}} <br> {{procTrialData}}%</h6>
            </div>
          </div>
        </article>
      </div>
      <div class="tile is-parent">
        <article class="tile is-child box">
          <div class="columns">
            <div class="column">
              <chart :type="'doughnut'" :data="chartData1" :options="options"></chart>
            </div>
            <div class="column">
              <h6 class="title">Free: {{freeData}} <br> {{procFreeData}}%</h6>
            </div>
          </div>
        </article>
      </div>
    </div>

    <div class="tile is-ancestor">
      <div class="tile is-vertical is-12">
        <div class="tile">
          <div class="tile is-parent">
            <article class="tile is-child box">
              <p class="title">New customers for the last 30 days</p>
              <div class="content chart-wrapper">
                <chart :type="'line'" :data="loadData"></chart>
                <div class="line-block"></div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Chart from 'vue-bulma-chartjs'
  import Axios from 'axios'
  import Vue from 'vue'
  import { mapGetters, mapActions } from 'vuex'
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
      Chart,
      Axios,
      Message
    },
    data () {
      return {
        activeData: 0,
        freeData: 0,
        trialData: 0,
        procActiveData: '',
        procFreeData: '',
        procTrialData: '',
        statisticsObj: '',
        series: 'Customers statistics',
        procentData: '',
        statData: [],
        statDataKey: [],
        activateToken: 0,
        dataActive: [],
        dataFree: [],
        dataTrial: [],
        options: {
          segmentShowStroke: false,
          cutoutPercentage: 50,
          legend: {
            display: false
          }
        },
        backgroundColor: ['#0080ff', '#f5f5f5']
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
      chartData () {
        return {
          labels: ['Active', 'Other'],
          datasets: [{
            data: this.dataActive,
            backgroundColor: this.backgroundColor
          }]
        }
      },
      chartData1 () {
        return {
          labels: ['Free', 'Other'],
          datasets: [{
            data: this.dataFree,
            backgroundColor: this.backgroundColor
          }]
        }
      },
      chartData2 () {
        return {
          labels: ['Trial', 'Other'],
          datasets: [{
            data: this.dataTrial,
            backgroundColor: this.backgroundColor
          }]
        }
      },
      ...mapGetters({ baseUrl: 'getBaseUrl', token: 'getTokenKey', errorMessage: 'getErrorMessage', statusWindow: 'getStatusWindow', loader: 'getLoaderState' }),
      loadData () {
        let data = {
          labels: this.statData,
          datasets: [{
            data: this.statDataKey,
            borderWidth: 2
          }],
          options: {
            legend: {
              display: false
            },
            label: {
              display: false
            }
          }
        }
        return data
      },
      pieData () {
        let data = this.activeData + this.freeData + this.trialData
        this.procActiveData = parseFloat((this.activeData / data) * 100).toFixed(1).toString()
        this.procTrialData = parseFloat((this.trialData / data) * 100).toFixed(1).toString()
        this.procFreeData = parseFloat((this.freeData / data) * 100).toFixed(1).toString()
        this.procentData = data
      }
    },
    mounted () {
      this.getAllData()
    },
    methods: {
      ...mapActions(['mutateLoaderState']),
      getAllData () {
        this.mutateLoaderState(true)
        let url = this.baseUrl + 'admin/statistic/license-count-by-status-and-last30days'
        Axios.get(url, {headers: {'Token-Key': this.token}})
          .then(response => {
            this.mutateLoaderState(false)
            let serverData = response.data
            this.statisticsObj = serverData.graph
            this.activeData = serverData.activeItem
            this.freeData = serverData.freeItem
            this.trialData = serverData.trialItem
            for (let item in this.statisticsObj) {
              this.statData.push(item)
              this.statDataKey.push(this.statisticsObj[item])
            }
            let sumActive = this.freeData + this.trialData
            let sumFree = this.activeData + this.trialData
            let sumTrial = this.activeData + this.freeData
            this.dataActive.push(this.activeData)
            this.dataActive.push(sumActive)
            this.dataTrial.push(this.trialData)
            this.dataTrial.push(sumTrial)
            this.dataFree.push(this.freeData)
            this.dataFree.push(sumFree)
          })
          .catch(error => {
            console.log(error)
            this.openMessageWithType(error)
            this.mutateLoaderState(false)
          })
      },
      refreshData () {
        this.statisticsObj = ''
        this.activeData = 0
        this.freeData = 0
        this.trialData = 0
        this.statData = []
        this.statDataKey = []
        this.dataActive = []
        this.dataActive = []
        this.dataTrial = []
        this.dataTrial = []
        this.dataFree = []
        this.dataFree = []
        this.getAllData()
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
      }
    }
  }

</script>

<style lang="scss" scoped>
  .refresh-button-main {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 100;
  }

  .chart-wrapper {
    position: relative;
    .line-block {
      height: 23px;
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 10000;
      background-color: #fff;
    }
  }

</style>
