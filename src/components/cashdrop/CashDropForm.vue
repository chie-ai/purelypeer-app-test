<template>
  <div id="quest-list">
    <div class="col-12 quest-container q-mt-none q-mb-none bg-grey-2" ref="questList">
      <div class="q-px-none bg-grey-2">
        <q-card class="my-card q-pt-xs q-mx-none bg-grey-2 q-mb-md no-shadow" ref="formCard">
          <q-card-section ref="questCardHeader">
            <div class="text-h6 quest-caption">
              Quest Form
              <!-- <q-btn color="white" text-color="black" rounded @click="checkBal">Check</q-btn> -->
              <q-btn color="white" @click="toggleQuestList" style="position: absolute; right: 16px; top: 14px" rounded :dense="true" text-color="black" :icon="questExpanderIcon" />
            </div>
          </q-card-section>

          <q-separator class="q-mx-md" ref="cardSeparator"/>

          <q-card-section class="q-pt-sm bg-grey-2">
            <div>
              <div class="row q-mb-md">
                <div class="col-12 q-pt-md">
                  <q-form ref="questForm" class="q-gutter-y-sm q-mx-none" method="post" @submit="onSubmitQuest" >
                    <q-select ref="radiusModel" bg-color="input-bg" filled color="input-color" :dense="true" v-model="radiusModel"
                      :options="radius.options" label="Quest Radius"
                      lazy-rules :rules="[val => !!val || 'Quest radius is required']" />
                    <q-input ref="merchantName" bg-color="input-bg" filled color="input-color" :dense="true" label="Merchant Name" type="text" lazy-rules v-model="merchantName"
                      :rules="[val => !!val || 'Merchant name is required']" />
                    <q-input ref="phoneNumber" bg-color="input-bg" filled color="input-color" :dense="true" label="Phone number" v-model="phoneNumber"
                      mask="(+##) ###-###-####" fill-mask unmasked-value class="q-mb-lg" />
                    <q-input ref="contactUrl" bg-color="input-bg" filled color="input-color" :dense="true" label="Contact URL" type="url" v-model="contactUrl" class="q-mb-lg" />
                    <q-input ref="memo" bg-color="input-bg" filled color="input-color" :dense="true" label="Memo" type="text" v-model="memo" class="q-mb-lg" />
                    <q-select ref="tierModel" bg-color="input-bg" filled color="input-color" :dense="true" v-model="tierModel"
                      :options="tier.options" label="PurelyPeer Tier"
                      lazy-rules :rules="[val => !!val || 'PurelyPeer tier is required']" />
                    <q-select ref="presenceModel" bg-color="input-bg" filled color="input-color" :dense="true" v-model="presenceModel"
                      :options="presence.options" label="Physical Presence"
                      lazy-rules :rules="[val => !!val || 'Physical presence is required']" />
                    <q-badge class="slider-badge text-caption">
                      <b>Total value</b>
                    </q-badge>
                    <q-slider class="q-mt-none q-mb-none amount-range-slider"
                      :value="amount"
                      v-model="amount"
                      :min="0.00000000"
                      :max="1.00000000"
                      :step="0.00000001"
                      label
                      :label-value="amount"
                    />
                    <q-input ref="amount" bg-color="input-bg" filled color="input-color" :dense="true" outlined label="Total value" type="text"
                    v-model="amount2" mask="#.########" fill-mask="0.00000000"
                    lazy-rules :rules="[val => val > 0.00000000 || 'Amount field is required to be set']"
                    input-class="text-right" />
                      <q-badge class="slider-badge text-caption">
                        <b>Number of cashdrops : {{ cashDropCountModel }}</b>
                      </q-badge>
                    <q-slider class="q-mt-none q-mb-sm amount-range-slider"
                        :value="2"
                        v-model="cashDropCountModel"
                        :min="2"
                        :max="100"
                        :step="1"
                      label/>
                    <q-input bg-color="input-bg" filled color="input-color" :dense="true" outlined
                          v-model="feeBreakdown" mask="#.########" fill-mask="0.00000000" label="Fee Breakdown"
                          input-class="text-right" class="q-mb-lg" readonly />

                    <q-input ref="password" bg-color="input-bg" filled color="input-color" :type="isPwd ? 'password' : 'text'" :dense="true" label="Password"
                    v-model="password" >

                      <template v-slot:append>
                        <q-icon
                          :name="isPwd ? 'visibility_off' : 'visibility'"
                          class="cursor-pointer"
                          @click="isPwd = !isPwd"
                        />
                      </template>
                    </q-input>
                    <q-btn :label="'Cash Drop \uD83D\uDCA7'" type="submit" class="full-width q-mt-lg quest-btn"/>
                  </q-form>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <BCHAddress class="hidden" ref="bchAddress" v-on:cancelQuest="cancelQuest"/>
    <LogoLoading class="hidden" ref="logoLoader" />
  </div>
</template>

<script>
import { Plugins } from '@capacitor/core'
import { QSpinner } from 'quasar'
import LogoLoading from '../LogoLoading.vue'
import BCHAddress from '../../components/cashdrop/flash-components/BchAddress.vue'
import Confirmation from '../../components/cashdrop/flash-components/Confirmation.vue'
import Confirmation2 from '../../components/cashdrop/flash-components/Confirmation2.vue'
import server from '../../utils/getAPIServer.js'

const { Geolocation } = Plugins

export default {
  data () {
    return {
      refModels: ['merchantName', 'phoneNumber', 'contactUrl', 'memo', 'tierModel', 'presenceModel', 'radiusModel', 'amount', 'password'],
      merchantName: null,
      phoneNumber: null,
      contactUrl: null,
      memo: null,
      tierModel: 'Upcoming \uD83D\uDC99',
      tier: {
        options: [
          'Direct \uD83D\uDC9A', 'Indirect \uD83E\uDDE1', 'Upcoming \uD83D\uDC99'
        ]
      },
      presenceModel: 'No \uD83E\uDDF1\u274C',
      presence: {
        options: [
          'Yes \uD83E\uDDF1\u2714\uFE0F', 'No \uD83E\uDDF1\u274C'
        ]
      },
      radiusModel: '15 min \uD83D\uDD7A\u267F\uD83D\uDC83',
      radius: {
        options: [
          '15 min \uD83D\uDD7A\u267F\uD83D\uDC83', 'Urban \uD83C\uDFD9\uFE0F', 'Regional \uD83D\uDEE3\uFE0F', 'Continental \uD83C\uDF10'
        ]
      },
      amount: 0.00020000,
      amount2: 0.00020000,
      cashDropCountModel: 2,
      cashDropFormModels: {
        tier: 'Upcoming',
        radius: 1500
      },
      feeBreakdown: 0.00004000,
      amountBoolean: false,
      questPresence: false,
      balanceWatcher: null,
      questExpanderIcon: 'mdi-arrow-expand-all',
      price: null,
      questCoordinates: null,
      // loading: null,
      password: null,
      isPwd: true
    }
  },
  components: {
    BCHAddress,
    LogoLoading
  },
  props: ['questGivenCoordinates'],
  watch: {
    radiusModel (newRadius, oldRadius) {
      if (newRadius) {
        this.changeRadius()
      }

      console.log('Radius: ', newRadius)
    },
    tierModel (newTier, oldTier) {
      this.changeTier()
    },
    cashDropCountModel (newBreakdown, oldBreakdown) {
      // Calculate the fee of settled cashdrops
      const T = 0.00002000, N = this.cashDropCountModel, OT = N * T
      this.feeBreakdown = OT.toFixed(8)
    },
    presenceModel (newPresence, oldPresence) {
      if (this.presence.options.indexOf(newPresence) === 0) {
        this.questPresence = true
      }
    },
    amount (newAmount, oldAmount) {
      this.amount2 = newAmount
    },
    questGivenCoordinates (newCoors, oldCoors) {
      this.questCoordinates = this.questGivenCoordinates
    }
  },
  methods: {
    toggleCashDropForm () {
      this.$refs.questList.classList.remove('hidden')
      this.$refs.bchAddress.$el.classList.add('hidden')
      document.getElementById('nav-menu').classList.remove('hidden')
      document.getElementsByClassName('exploreMap')[0].classList.remove('hidden')
      document.getElementById('nav-menu').classList.add('animate-in-load')
      document.getElementsByClassName('cashdrop-form')[0].classList.add('animate-in-load')
      document.getElementsByClassName('btn-cancel')[0].classList.add('hidden')
    },
    cancelQuest () { // cancels the quest form by refreshing each input
      this.toggleCashDropForm()
      this.$emit('routeStatus', true)
      // for (let i = 0; this.refModels.length > i; i++) {
      //   this[this.refModels[i]] = this.refModels[i] === 'amount' ? 0.00000000 : null
      //   this.$refs[this.refModels[i]].resetValidation()
      // }
      // this.$q.notify({ message: 'The quest has been canceled!', color: 'alert-color', position: 'bottom', timeout: 3000 })
      clearInterval(this.balanceWatcher)
    },
    onSubmitQuest (evt) { // checks the validity of the data given in the form before proceeding in creating the quest
      const bchAddress = localStorage.getItem('bchAddress')
      this.$refs.questForm.validate().then(success => {
        if (success) {
          const balanceLoader = this.$q.dialog({
            message: 'Checking your wallet balance...',
            progress: {
              spinner: QSpinner,
              color: 'balance-spinner-color'
            },
            persistent: true, // we want the user to not be able to close it
            ok: false // we want the user to not be able to close it
          })

          const coordinates = []
          console.log('Coordinates: ', this.questCoordinates)
          for (let i = 0; Object.keys(this.questCoordinates).length > i; i++) {
            coordinates.push((Object.values(this.questCoordinates)[i]).toFixed(8))
          }

          const questCreate = {
            user: localStorage.getItem('user_id'),
            token: '-',
            name: this.merchantName,
            phone_no: this.phoneNumber !== null ? ('+' + this.phoneNumber) : null,
            contact_url: this.contactUrl,
            memo: this.memo,
            acceptance_tier: this.cashDropFormModels.tier,
            coors: coordinates,
            radius: this.cashDropFormModels.radius,
            claim_passcode: this.password,
            total_cashdrops: this.cashDropCountModel,
            has_physical_presence: this.questPresence,
            amount: this.amount.toFixed(8),
            payment_address: bchAddress, /* bchAddress */
            pubkey: localStorage.getItem('pubkey') /* localStorage.getItem('pubkey') */
          }

          // const overAllAmount = (Number(this.amount.toFixed(8)) + Number(this.feeBreakdown))
          const overAllAmount = this.amount.toFixed(8)

          this.$emit('routeStatus', false)

          // Check the user's wallet balance if sufficient before proceeding to creation of quest
          server.bchjs.Electrumx.balance(bchAddress).then(res => { /* bchAddress */
            const sumSatoshis = res.balance.confirmed + res.balance.unconfirmed
            const balance = (server.bchjs.BitcoinCash.toBitcoinCash(sumSatoshis)).toFixed(8)
            console.log('Balance: ', balance)

            balanceLoader.hide()

            if (balance > overAllAmount) {
              this.$q.dialog({
                component: Confirmation,
                parent: this
              }).onOk(() => {
                this.$refs.questList.classList.add('hidden')
                document.getElementById('nav-menu').classList.add('hidden')
                document.getElementsByClassName('exploreMap')[0].classList.add('hidden')

                this.$refs.logoLoader.$el.classList.remove('hidden')
                this.$refs.logoLoader.$el.classList.add('animate-loader')
                this.$refs.logoLoader.$el.classList.remove('animate-hiding')
                this.createQuest(questCreate)
              }).onCancel(() => {
                this.$emit('routeStatus', true)
              })
            } else {
              this.$refs.questList.classList.add('hidden')
              document.getElementById('nav-menu').classList.add('hidden')
              document.getElementsByClassName('exploreMap')[0].classList.add('hidden')
              this.$refs.bchAddress.$el.classList.remove('hidden')

              setTimeout(() => {
                document.getElementsByClassName('btn-cancel')[0].classList.remove('hidden')
              }, 5000)

              const pollingBalance = () => {
                server.bchjs.Electrumx.balance(bchAddress).then(res => {
                  const sumSatoshis = res.balance.confirmed + res.balance.unconfirmed
                  const balance = (server.bchjs.BitcoinCash.toBitcoinCash(sumSatoshis)).toFixed(8)
                  console.log('Balance: ', balance)
                  if (balance > overAllAmount) {
                    clearInterval(this.balanceWatcher)
                  }
                  if (balance > overAllAmount) {
                    this.$q.dialog({
                      component: Confirmation2,
                      parent: this
                    }).onOk(() => {
                      this.$refs.bchAddress.$el.classList.add('hidden')

                      this.$refs.logoLoader.$el.classList.remove('hidden')
                      this.$refs.logoLoader.$el.classList.add('animate-loader')
                      this.$refs.logoLoader.$el.classList.remove('animate-hiding')
                      this.createQuest(questCreate)
                    }).onCancel(() => {
                      this.cancelQuest()
                    })
                  }
                }).catch(err => {
                  console.error(err)
                })
              }
              this.balanceWatcher = setInterval(pollingBalance, 10000)
            }
          }).catch(err => {
            console.log('Error: ', err)
          })
        }
      })
    },
    createQuest (questCreate) { // Create the quest
      this.$emit('routeStatus', true)
      this.$store.dispatch('cashdrop/createQuest', questCreate).then(response => {
        console.log('Response: ', response)

        for (let i = 0; this.refModels.length > i; i++) {
          this[this.refModels[i]] = this.refModels[i] === 'amount' ? 0.00000000 : null
          this[this.refModels[i]] = this.refModels[i] === 'radiusModel' ? '15 min \uD83D\uDD7A\u267F\uD83D\uDC83' : null
          this.$refs[this.refModels[i]].resetValidation()
        }

        this.$emit('routeStatus', true)
        const quest = response.data
        quest.fee_break_down = this.feeBreakdown
        this.$router.push({ path: 'confirm-transaction', query: quest })
      }).catch(error => {
        console.log('Error in creating: ', error)

        /** Show the map and quest form */
        this.$refs.questList.classList.remove('hidden')
        document.getElementById('nav-menu').classList.remove('hidden')
        document.getElementsByClassName('exploreMap')[0].classList.remove('hidden')

        /** Removes Logo Loading */
        this.$refs.logoLoader.$el.classList.remove('animate-loader')
        this.$refs.logoLoader.$el.classList.add('animate-hiding')
        setTimeout(() => {
          this.$refs.logoLoader.$el.classList.add('hidden')
        }, 300)

        /** Checks which part is the error */
        let errorMsg = error.toString()
        if (typeof error !== 'string') {
          errorMsg = 'amount' in error ? error.amount : 'coors' in error ? error.coors : ''
        } else {
          errorMsg = 'Server Error (500)'
        }

        console.log('Error msg: ', error.toString())

        /** Displays the error message */
        this.$q.notify({
          message: errorMsg,
          color: 'red',
          position: 'top',
          timeout: 3000
        })
      })
    },
    changeTier () { // To emit the changes of tier in the form to the map
      let tierIcon = 'PurelyPeer-icon-black.png'
      let tier = 'inactive'
      this.cashDropFormModels.tier = 'Inactive'
      if (this.tier.options.indexOf(this.tierModel) === 0) {
        tierIcon = 'PurelyPeer-location-green.png'
        tier = 'direct'

        this.cashDropFormModels.tier = 'Direct'
      } else if (this.tier.options.indexOf(this.tierModel) === 1) {
        tierIcon = 'PurelyPeer-location-orange.png'
        tier = 'indirect'

        this.cashDropFormModels.tier = 'Indirect'
      } else if (this.tier.options.indexOf(this.tierModel) === 2) {
        tierIcon = 'PurelyPeer-location-blue.png'
        tier = 'upcoming'

        this.cashDropFormModels.tier = 'Upcoming'
      }
      const tierObject = {
        tierIcon,
        tier
      }
      this.$emit('changeQuestTier', tierObject)
    },
    changeRadius () { // To emit the changes of radius in the form to the map
      let radius = 1500000
      this.cashDropFormModels.radius = radius
      if (this.radius.options.indexOf(this.radiusModel) === 0) {
        radius = 1500

        this.cashDropFormModels.radius = radius
      } else if (this.radius.options.indexOf(this.radiusModel) === 1) {
        radius = 15000

        this.cashDropFormModels.radius = radius
      } else if (this.radius.options.indexOf(this.radiusModel) === 2) {
        radius = 150000

        this.cashDropFormModels.radius = radius
      }
      this.$emit('changeQuestRadius', radius)
    },
    toggleQuestList (e) { // toggles between full size and normal size of the quest list
      const formCard = this.$refs.formCard.$el.classList
      formCard.toggle('card-expander')
      this.questExpanderIcon = formCard.contains('card-expander') ? 'mdi-arrow-collapse-all' : 'mdi-arrow-expand-all'
      this.$refs.questCardHeader.$el.classList.toggle('card-header')
      this.$refs.cardSeparator.$el.classList.toggle('card-ceparator')
    },
    async checkBal () {
      // console.log('UTXO: ', await server.bchjs.Electrumx.balance('bitcoincash:qzuna0c5tvpzne7gennzzl73pr6pd0pzqqzvjlmgq5'))
      console.log('UTXO: ', await server.bchjs.Utxo.get(localStorage.getItem('bchAddress')))
    }
  },
  async created () {
    Geolocation.getCurrentPosition().then(position => {
      this.questCoordinates = [position.coords.latitude, position.coords.longitude]
    }).catch(error => console.log('Unable to retreive your location: ', error))

    // console.log('UTXO: ', await server.bchjs.Utxo.get(bchAddress))
    const bal = await server.bchjs.Electrumx.balance(localStorage.getItem('bchAddress'))
    console.log('Balance: ', (Number(bal.balance.confirmed) + Number(bal.balance.unconfirmed)))
  }
}
</script>

<style>
.text-spinner-color {
  color: #0AC18E !important;
}
.bg-alert-color {
  background-color: #0AC18E !important;
}
.bg-notify-color {
  background-color: #0AC18E;
}
.text-balance-spinner-color {
  color: #0AC18E;
}
.amount-range-slider {
  color: #0AC18E;
}
.slider-badge {
  background: #0AC18E;
}
.amount-error {
  font-size: 11px;
  color: #B00303;
}
.quest-btn {
  background: radial-gradient(circle, #0CDAA1 0%, #0AC18E 100%) !important;
  color: white;
}
.bg-input-bg {
  /* background: #B5ECDD !important; */
  background: white !important;
}
.text-input-color {
  color: #0AC18E;
}
.card-expander {
  position: absolute;
  width: 100%;
  top: 0pt;
  left: 0pt;
  z-index: 3000;
  border-radius: 0;
}
.card-header {
  position: fixed;
  top: 0pt;
  height: 61px;
  width: 100%;
  background: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  z-index: 3000;
}
.card-ceparator {
  margin-top: 56px;
}
.animate-loader {
  animation: 1s appear;
}
@keyframes appear {
  0% {
    opacity: 0;
  }
}
.animate-hiding {
  opacity: 0;
  transition: opacity .5s;
}
</style>
