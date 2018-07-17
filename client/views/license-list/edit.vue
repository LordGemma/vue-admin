<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-vertical is-12">
        <div class="tile">
          <div class="tile is-parent">
            <article class="tile is-child box">
              <ul class="control">
                <li class="button is-info is-outlined" @click.prevent="back()">
                  <span class="icon">
                    <i class="fa fa-chevron-left" aria-hidden="true"></i>
                  </span>
                  <span>BACK</span>
                </li>
              </ul>
              <p class="title has-text-centered">Wizard Form</p>
              <p class="subtitle has-text-centered">Customer and License</p>
              <p class="current-license subtitle has-text-centered">Current license: {{ currentLicense }}</p>
              <div class="content tile parent">
                <article class="tile is-child">
                  <div class="block">
                    <div class="control has-icon has-icon-right is-horizontal">
                      <div class="columns fullwidth-block">
                        <div class="column">
                          <h2 class="title has-text-centered">Select customer</h2>
                          <div class="select is-fullwidth">
                            <select v-model="value" @change="getSelectValue($event.target.value)">
                              <option :selected="customer.value" v-for="customer in customers" :value="customer.value">{{ customer.text }}</option>
                            </select>
                          </div>
                        </div>
                        <div class="column">
                          <h2 class="title has-text-centered">Select license</h2>
                          <div class="select is-fullwidth">
                            <select @change="getLicenseData($event.target.value)" v-model="selected">
                              <option v-for="license in formData.customerLicense" :value="license">{{ license }}</option>
                              <option value="Create License">Create License</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                    <form id="sedForm" @submit.prevent="onSubmit">
                      <div class="control has-icon has-icon-right is-horizontal is-centered">
                        <div class="columns tile is-12" v-model="formData">
                          <div class="column">
                            <label class="label">Expiration Date <span class="required-star">*</span></label>
                            <div class="control has-icon has-icon-right">
                              <!--<datepicker ref="checkIn" v-model="formData.licenseExpirationDate" :config="{ dateFormat: 'm/d/Y', defaultDate: this.formData.licenseExpirationDate }"></datepicker>-->
                              <Flatpickr class="input" v-model="formData.licenseExpirationDate" :options="fpOptions"></Flatpickr>
                            </div>
                          </div>
                          <div class="column">
                            <label class="label">Status</label>
                            <div class="control has-icon has-icon-right">
                              <div class="select is-fullwidth">
                                <select v-model="formData.customerStatus" :disabled="disable" @change="getSelectStatus(formData.customerStatus)">
                                  <option :selected="formData.customerStatus" :value="formData.customerStatus">{{ formData.customerStatus | capitalize }}</option>
                                  <option :value="formData.customerStatus === 'trial' ? 'active' : 'free'">{{ formData.customerStatus === 'trial' ? 'active' : 'free' | capitalize }}</option>
                                  <option v-if="formData.customerStatus === 'trial'" value="free">Free</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="is-horizontal is-centered tile is-12" v-model="formData" v-bind="formData">
                        <div class="columns fullwidth-block">
                          <div class="column is-12">
                            <label class="label">Description</label>
                            <textarea v-model="formData.licenseNote" class="textarea" placeholder="Describe Your Customer">{{formData.licenseNote}}</textarea>
                          </div>
                        </div>
                      </div>
                      <div v-if="customerLicenseDefault === 'Create License'" class="control has-icon has-icon-right save-button create-button">
                        <button type="submit" class="button is-primary is-outlined is-medium">Create</button>
                      </div>
                      <div class="control has-icon has-icon-right save-button" v-else>
                        <button type="submit" class="button is-info is-outlined is-medium">Save</button>
                      </div>
                    </form>
                  </div>
                </article>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
  import Axios from 'axios'
  import Datepicker from 'vue-bulma-datepicker'
  import moment from '../../../node_modules/moment'
  import { mapMutations, mapGetters, mapActions } from 'vuex'
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
      Datepicker,
      moment,
      Message
    },
    data () {
      return {
        personId: this.sessionUserId,
        value: '',
        selected: '',
        customerData: '',
        customers: [],
        disable: false,
        expDate: '',
        timestamp: '',
        currentLicense: '',
        sessionUserId: null,
        customerLicenseDefault: '',
        formData: {
          customerId: 0,
          licenseExpirationDate: '',
          customerStatus: '',
          customerLicense: [],
          licenseNote: ''
        },
        fpOptions: {
          minDate: new Date().fp_incr(-30),
          dateFormat: 'm/d/Y',
          defaultDate: new Date(this.timestamp),
          onOpen: [
            function (selectedDates, dateStr, instance) {
              instance.setDate(dateStr)
            }
          ]
        }
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
      if (this.$session.has('sessionUserId')) {
        this.value = this.$session.get('sessionUserId')
      }
      this.getSelectValue(this.value)
      this.getAllCustomers()
      if (this.formData.customerStatus === '' || this.formData.customerStatus === undefined) {
        this.formData.customerStatus = 'active'
      }
    },
    watch: {
      customerStatus () {
        if (this.formData.customerStatus === '' || this.formData.customerStatus === undefined) {
          this.formData.customerStatus = 'active'
        }
      },
      expDate (val) {
      }
    },
    computed: {
      ...mapGetters({ baseUrl: 'getBaseUrl', loader: 'getLoaderState', token: 'getTokenKey', getPersonId: 'getCustomerId', errorMessage: 'getErrorMessage', statusWindow: 'getStatusWindow' })
    },
    methods: {
      ...mapActions(['mutateLoaderState', 'mutateMessageState']),
      getSelectStatus (event) {
        if (this.formData.customerStatus === '' || this.formData.customerStatus === undefined) {
          this.formData.customerStatus = 'active'
        } else {
          this.formData.customerStatus = event
        }
      },
      back () {
        this.$router.go(window.history.back())
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
      ...mapMutations([
        'customerId'
      ]),
      getAllCustomers () {
        this.mutateLoaderState(true)
        let url = this.baseUrl + 'admin/customer/get-all'
        Axios.get(url, {headers: {'Token-Key': this.token}})
          .then(response => {
            this.mutateLoaderState(false)
            let customersData = response.data
            for (let i = 0; i < customersData.length; i++) {
              let personData = { text: customersData[i].customerName, value: customersData[i].customerId.toString() }
              this.customers.push(personData)
            }
            this.value = this.getPersonId
            this.formData.customerId = this.getPersonId
            this.getSelectValue(this.formData.customerId)
          })
          .catch(e => {
            console.log(e)
            this.mutateLoaderState(false)
            this.openMessageWithType(e)
          })
      },
      getSelectValue (id) {
        this.mutateLoaderState(true)
        this.$session.start()
        this.$session.set('sessionUserId', id)
        let url = this.baseUrl + 'admin/customer/get?customer-id=' + id
        Axios.get(url, {headers: {'Token-Key': this.token}})
          .then(response => {
            this.mutateLoaderState(false)
            this.formData.customerId = response.data.customerId
            this.formData.customerLicense = response.data.licenseKey
            this.getLicenseData(this.formData.customerLicense[0])
            this.selected = this.formData.customerLicense[0]
          })
          .catch(e => {
            console.log(e)
            this.mutateLoaderState(false)
            this.openMessageWithType(e)
          })
      },
      getLicenseData (license) {
        this.mutateLoaderState(true)
        this.currentLicense = license
        this.customerLicenseDefault = license
        if (license !== 'Create License') {
          let url = this.baseUrl + 'admin/license/get?license-key=' + license
          Axios.get(url, {headers: {'Token-Key': this.token}})
            .then(response => {
              this.mutateLoaderState(false)
              this.formData.licenseNote = response.data.licenseNote
              this.formData.customerStatus = response.data.licenseStatus
              this.timestamp = response.data.licenseExpirationDate
              this.getDateFromSeconds(response.data.licenseExpirationDate)
              this.disable = false
            })
            .catch(e => {
              console.log(e)
              this.mutateLoaderState(false)
              this.openMessageWithType(e)
            })
        } else if (license === 'Create License') {
          this.mutateLoaderState(false)
          let day = moment.utc(new Date().getTime() + 2629743000).format('MM/DD/YYYY')
          this.formData.customerStatus = 'active'
          this.formData.licenseNote = ''
          this.disable = true
          this.expDate = day
          this.formData.licenseExpirationDate = day
        }
      },
      onSubmit () {
        this.$validator.validateAll().then(() => {
          this.mutateLoaderState(true)
          let url
          let formData
          if (this.customerLicenseDefault !== 'Create License') {
            url = this.baseUrl + 'admin/license/edit'
            this.mutateMessageState({message: 'The data of the customer\'s license was updated', status: 'success'})
            formData = {
              licenseKey: this.customerLicenseDefault,
              licenseExpiration: new Date(this.formData.licenseExpirationDate).getTime(),
              licenseStatus: this.formData.customerStatus,
              licenseNote: this.formData.licenseNote
            }
          } else if (this.customerLicenseDefault === 'Create License') {
            url = this.baseUrl + 'admin/license/create'
            this.mutateMessageState({message: 'The customer\'s license was created', status: 'success'})
            formData = {
              customerId: this.formData.customerId,
              licenseExpiration: new Date(this.formData.licenseExpirationDate).getTime(),
              licenseStatus: this.formData.customerStatus,
              licenseNote: this.formData.licenseNote
            }
          }
          Axios.post(url, formData, {headers: {'Token-Key': this.token}})
            .then(response => {
              this.mutateLoaderState(false)
              this.getAllCustomers()
              this.openMessageWithType()
              this.getLicenseData(response.data.licenseKey)
            })
            .catch(e => {
              console.log(e)
              this.mutateLoaderState(false)
              this.openMessageWithType(e)
              this.getAllCustomers()
            })
        }).catch(() => {
          // eslint-disable-next-line
          console.log('Correct them errors!')
        })
      },
      getDateFromSeconds (exp) {
        let dateNew = moment(exp).format('MM/DD/YYYY')
        this.formData.licenseExpirationDate = dateNew
      }
    },
    editCustomerForId () {
      if (this.personId === 0) {
        return this.value
      } else {
        return this.personId
      }
    }
  }
</script>

<style lang="scss">
  input[type="checkbox"] {
    width: 20px;
    height: 20px;
  }
  .create-button {
    margin-top: 25px;
  }
  .fullwidth-block {
    width: 100%;
    padding-bottom: 30px;
  }
  .save-button {
    margin-top: 25px;
    display: flex;
    button {
      margin: auto;
    }
  }
  .current-license {
    margin-top: -15px;
    margin-bottom: 30px !important;

  }
  .flatpickr-day.selected {
    position: relative;
    transition: all .3s linear;
    &:after {
      transition: all .3s linear;
      font-size: 12px;
      content: 'Expiration Date';
      color: #333;
      position: absolute;
      bottom: 40px;
      right: 20px;
      display: none;
      width: 65px;
      line-height: 1.5;
      background-color: #eee;
      border-radius: 5px 5px 0 5px;
      box-shadow: 0 0 10px;
    }
    &:hover::after {
      display: inline-block;
    }
  }
  .flatpickr-day.today {
    position: relative;
    transition: all .3s linear;
    &:after {
      transition: all .3s linear;
      font-size: 12px;
      content: 'Current Date';
      color: #333;
      position: absolute;
      bottom: 40px;
      right: 20px;
      display: none;
      width: 65px;
      line-height: 1.5;
      background-color: #eee;
      border-radius: 5px 5px 0 5px;
      box-shadow: 0 0 10px;
    }
    &:hover::after {
      display: inline-block;
    }
  }

</style>
