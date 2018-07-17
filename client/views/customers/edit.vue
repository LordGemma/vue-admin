<template>
  <div v-cloak>
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
              <div class="content">
                <article class="tile is-child">
                  <h1 class="title has-text-centered" id="createdCustomer">Select Customer</h1>
                  <div class="block">
                    <div class="control is-horizontal">
                      <div class="control columns">
                        <div class="column is-8 is-offset-2">
                          <div class="select is-fullwidth">
                            <select id="customer-select" v-model="selected" @change="getSelectValue(selected)">
                              <option :selected="selected" v-for="customer in customers" :value="customer.value">{{ customer.text }}</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                    <form id="sedForm" @submit.prevent="onSubmit">
                      <div class="control is-horizontal is-centered">
                        <div class="columns tile is-12" v-model="formData" v-bind="formData">
                          <div class="column">
                            <label class="label">Name <span class="required-star">*</span></label>
                            <div class="control has-icon has-icon-right">
                              <input name="name" v-validate="'required|min:3'" v-model="formData.customerName" :value="formData.customerName" :class="{'input': true, 'is-danger': errors.has('name') }" class="input" type="text" placeholder="Customer Name">
                              <span class="icon is-small">
                                <i v-show="errors.has('name')" class="fa fa-warning"></i>
                              </span>
                              <span v-show="errors.has('name')" class="help is-danger">{{ errors.first('name') }}</span>
                            </div>
                            <label class="label">Phone <span class="required-star">*</span></label>
                            <div class="control has-icon has-icon-right">
                              <input name="phone" v-validate="'required|numeric'" :class="{'input': true, 'is-danger': errors.has('phone') }" v-model="formData.customerPhone" :value="formData.customerPhone" class="input" type="text" placeholder="Phone Number"></input>
                              <span class="icon is-small">
                              <i v-show="errors.has('phone')" class="fa fa-warning"></i>
                              </span>
                              <span v-show="errors.has('phone')" class="help is-danger">{{ errors.first('phone') }}</span>
                            </div>
                            <label class="label">Email <span class="required-star">*</span></label>
                            <div class="control has-icon has-icon-right">
                              <input name="email" v-validate="'required|email'" v-model="formData.customerMail" :value="formData.customerMail" :class="{'input': true, 'is-danger': errors.has('email') }" type="text" placeholder="Email">
                              <span class="icon is-small">
                                <i v-show="errors.has('email')" class="fa fa-warning"></i>
                              </span>
                              <span v-show="errors.has('email')" class="help is-danger">{{ errors.first('email') }}</span>
                            </div>
                          </div>
                          <div class="column is-offset-1">
                            <label class="label">Address <span class="required-star">*</span></label>
                            <div class="control has-icon has-icon-right">
                              <input :class="{'input': true, 'is-danger': errors.has('address') }" name="address" v-validate="'required'" v-model="formData.customerAddress" :value="formData.customerAddress" class="input" type="text" placeholder="Location Address(State, City, Street)">
                              <span class="icon is-small">
                                <i v-show="errors.has('address')" class="fa fa-warning"></i>
                              </span>
                              <span v-show="errors.has('address')" class="help is-danger">{{ errors.first('address') }}</span>
                            </div>
                            <label class="label">Type</label>
                            <div class="control">
                              <div class="select is-fullwidth">
                                <select v-model="formData.customerType">
                                  <option :selected="typeSelect" :value="typeSelect">{{ typeSelect | capitalize }}</option>
                                  <option :value="formData.customerType === 'person' ? 'company' : 'person'">{{ formData.customerType === 'person' ? 'company' : 'person' | capitalize}}</option>
                                </select>
                              </div>
                            </div>
                            <label class="label">Description</label>
                            <div class="control">
                              <textarea v-model="formData.customerNote" class="textarea" placeholder="Describe Your Customer">{{formData.customerNote}}</textarea>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="control save-button">
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
      Message
    },
    data () {
      return {
        validator: null,
        personId: this.getPersonId,
        selected: '',
        customerData: '',
        responseId: 0,
        customers: [],
        formData: {
          customerId: null,
          customerName: '',
          customerPhone: '',
          customerMail: '',
          customerAddress: '',
          customerType: '',
          customerNote: ''
        }
      }
    },
    created () {
      if (this.$session.has('sessionUserId')) {
        this.sessionUserId = this.$session.get('sessionUserId')
      }
      this.getSelectValue(this.sessionUserId)
      this.getAllCustomers()
      this.selected = this.sessionUserId
    },
    watch: {
      responseId (val) {
      }
    },
    computed: {
      ...mapGetters({ baseUrl: 'getBaseUrl', loader: 'getLoaderState', getPersonId: 'getCustomerId', showModal: 'getModalVisible', token: 'getTokenKey', errorMessage: 'getErrorMessage', statusWindow: 'getStatusWindow' }),
      typeSelect () {
        if (this.formData.customerType === '' || this.formData.customerType === undefined) {
          this.formData.customerType = 'company'
        }
        return this.formData.customerType
      }
    },
    beforeCreate: function () {
      if (!this.$ls.get('tokenKey')) {
        this.$router.push('/')
      } else {
        this.$store.commit('getTokenKey', this.$ls.get('tokenKey'))
      }
    },
    methods: {
      ...mapActions(['mutateLoaderState', 'mutateMessageState']),
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
      onSubmit () {
        this.$validator.validateAll().then(() => {
          this.mutateLoaderState(true)
          let url
          let formData
          url = this.baseUrl + 'admin/customer/edit'
          this.mutateMessageState({message: 'The data of the customer was updated', status: 'success'})
          formData = this.formData

          Axios.post(url, formData, {headers: {'Token-Key': this.token}})
            .then(response => {
              this.mutateLoaderState(false)
              this.responseId = response.data.customerId
              this.getAllCustomers()
              this.openMessageWithType()
            })
            .catch(e => {
              console.log(e)
              this.mutateLoaderState(false)
              this.openMessageWithType(e)
              this.getAllCustomers()
//              if (e) {
//                this.$store.commit('modalVisible', true)
//                this.$router.push('/')
//              }
            })
        }).catch(() => {
          // eslint-disable-next-line
          console.log('Correct them errors!')
        })
      },
      getAllCustomers () {
        this.mutateLoaderState(true)
        let url = this.baseUrl + 'admin/customer/get-all'
        Axios.get(url, {headers: {'Token-Key': this.token}})
          .then(response => {
            this.mutateLoaderState(false)
            this.$store.commit('modalVisible', false)
            let customersData = response.data
            for (let i = 0; i < customersData.length; i++) {
              let personData = { text: customersData[i].customerName, value: customersData[i].customerId }
              this.customers.push(personData)
              if (customersData[i].customerId === this.responseId) {
                this.selected = customersData[i].customerId
              }
            }
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
            this.formData.customerName = response.data.customerName
            this.formData.customerPhone = response.data.customerPhone
            this.formData.customerMail = response.data.customerMail
            this.formData.customerAddress = response.data.customerAddress
            this.formData.customerType = response.data.customerType
            this.formData.customerNote = response.data.customerNote
          })
          .catch(e => {
            console.log(e)
            this.mutateLoaderState(false)
            this.openMessageWithType(e)
          })
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
  .save-button {
    margin-top: 25px;
    display: flex;
    button {
      margin: auto;
    }
  }

  [v-cloak] {
    display:none;
  }
  .required-star {
    color: red;
  }

</style>
