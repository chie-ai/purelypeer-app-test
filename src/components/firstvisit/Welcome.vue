<template>
  <div>
    <q-carousel
        v-model="slide"
        transition-prev="slide-right"
        transition-next="slide-left"
        swipeable
        animated
        control-color="control-color-1"
        navigation
        padding
        class="primary text-white shadow-1 carousel-style q-mt-lg q-pa-none"
        ref="guide_carousel"
    >

      <template v-slot:navigation-icon="{ active, btnProps, onClick }">
          <q-btn v-if="active" size="sm" :icon="btnProps.icon" color="control-color" flat round dense @click="onClick" />
          <q-btn v-else size="sm" :icon="btnProps.icon" class="control-color-1" flat round dense @click="onClick" />
      </template>

        <q-carousel-slide name="welcome" class="flex-center q-mb-md q-pt-none">
          <div class="q-px-lg q-pb-md q-pt-lg text-center">
            <img src="PurelyPeer-stamp.png" width="90%" class="rounded-borders">
          </div>
          <h5 class="q-my-md q-mb-md text-center">Welcome to PurelyPeer</h5>
          <div class="q-mt-md text-center guide-phrase" ref="guide_phrase">
            <p class="phrase">{{ lorem }}</p>
            <div class="see-more" @click="readMore" ref="see_more">
              <span class="read-more-text"><strong>Click here to read more...</strong></span>
            </div>
          </div>
        </q-carousel-slide>
        <q-carousel-slide name="guides" class="flex-center q-mb-md q-pt-none">
          <div class="q-px-lg q-pb-md q-pt-lg text-center">
            <img src="PurelyPeer-stamp.png" width="90%" class="rounded-borders">
          </div>
          <h5 class="q-my-md q-mb-md text-center">Guide</h5>
          <div class="q-mt-md text-center guide-phrase" ref="guide_phrase">
            <p class="phrase">{{ lorem }}</p>
            <div class="see-more" @click="readMore" ref="see_more">
              <span class="read-more-text"><strong>Click here to read more...</strong></span>
            </div>
          </div>
        </q-carousel-slide>
        <q-carousel-slide name="explore" class="flex-center q-mb-md q-pt-none">
          <div class="q-px-lg q-pb-md q-pt-lg text-center">
            <img src="PurelyPeer-stamp.png" width="90%" class="rounded-borders">
          </div>
          <h5 class="q-my-md q-mb-md text-center">Explore</h5>
          <div class="q-mt-md text-center guide-phrase" ref="guide_phrase">
            <p class="phrase">{{ lorem }}</p>
            <div class="see-more" @click="readMore" ref="see_more">
              <span class="read-more-text"><strong>Click here to read more...</strong></span>
            </div>
          </div>
        </q-carousel-slide>
        <q-carousel-slide name="cashdrop" class="flex-center q-mb-md q-pt-none">
          <div class="q-px-lg q-pb-md q-pt-lg text-center">
            <img src="PurelyPeer-stamp.png" width="90%" class="rounded-borders">
          </div>
          <h5 class="q-my-md q-mb-md text-center">Cashdrop</h5>
          <div class="q-mt-md text-center guide-phrase" ref="guide_phrase">
            <p class="phrase">{{ lorem }}</p>
            <div class="see-more" @click="readMore" ref="see_more">
              <span class="read-more-text"><strong>Click here to read more...</strong></span>
            </div>
          </div>
        </q-carousel-slide>
        <q-carousel-slide name="collect" class="flex-center q-mb-md q-pt-none">
          <div class="q-px-lg q-pb-md q-pt-lg text-center">
            <img src="PurelyPeer-stamp.png" width="90%" class="rounded-borders">
          </div>
          <h5 class="q-my-md q-mb-md text-center">Collect</h5>
          <div class="q-mt-md text-center guide-phrase" ref="guide_phrase">
            <p class="phrase">{{ lorem }}</p>
            <div class="see-more" @click="readMore" ref="see_more">
              <span class="read-more-text"><strong>Click here to read more...</strong></span>
            </div>
          </div>
        </q-carousel-slide>
        <q-carousel-slide name="settings" class="flex-center q-mb-md q-pt-none">
          <div class="q-px-lg q-pb-md q-pt-lg text-center">
            <img src="PurelyPeer-stamp.png" width="90%" class="rounded-borders">
          </div>
          <h5 class="q-my-md q-mb-md text-center">Settings</h5>
          <div class="q-mt-md text-center guide-phrase" ref="guide_phrase">
            <p class="phrase">{{ lorem }}</p>
            <div class="see-more" @click="readMore" ref="see_more">
              <span class="read-more-text"><strong>Click here to read more...</strong></span>
            </div>
          </div>
        </q-carousel-slide>
        <q-carousel-slide name="start" class="flex-center q-mb-md q-pt-none">
          <div class="q-px-lg q-pb-md q-pt-lg text-center">
            <img src="PurelyPeer-stamp.png" width="90%" class="rounded-borders">
          </div>
          <h4 class="q-my-md text-center">Start Now</h4>
          <div class="q-mt-md text-center">
          <q-btn
          rounded
          class="btn-proceed text-white q-mt-lg"
          size="md"
          label="Proceed"
          @click="createWallet"
          />
          </div>
        </q-carousel-slide>
    </q-carousel>
    <LogoLoading class="hidden" ref="logoLoader" />
  </div>
</template>

<script>
import LogoLoading from '../LogoLoading.vue'
import createWallet from '../../utils/create_wallet.js'
// import server from '../../utils/getAPIServer.js'
// import { QSpinnerFacebook } from 'quasar'

export default {
  data () {
    return {
      slide: 'welcome',
      lorem: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Itaque voluptatem totam, architecto cupiditate officia rerum, error dignissimos praesentium libero ab nemo. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Itaque voluptatem totam, architecto cupiditate officia rerum, error dignissimos praesentium libero ab nemo. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Itaque voluptatem totam, architecto cupiditate officia rerum, error dignissimos praesentium libero ab nemo. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Itaque voluptatem totam, architecto cupiditate officia rerum, error dignissimos praesentium libero ab nemo.',
      routeTimer: null,
      notifier: true,
      loading: false
    }
  },
  components: {
    LogoLoading
  },
  methods: {
    createWallet () {
      this.$refs.guide_carousel.$el.classList.add('hidden')

      this.loading = true

      // Create a wallet
      createWallet().then(response => {
        console.log('Creation of wallet response: ', response)
        this.$refs.logoLoader.$el.classList.remove('hidden')
        this.$refs.logoLoader.$el.classList.add('animate-loader')

        this.$store.commit('wallet/mutateSeedPhrase', response.mnemonic)

        // Stores wallet seed phrase, seed hash, pubkey and address in the localstorage (will be used for importing wallet)
        localStorage.setItem('seedPhrase', response.mnemonic)
        localStorage.setItem('seedHash', response.seedHash)
        localStorage.setItem('pubkey', response.publicKey)
        localStorage.setItem('bchAddress', response.bchAddress)
        localStorage.setItem('slpAddress', response.slpAddress)

        const wallet = {
          seed_hash: response.seedHash,
          bch_address: response.bchAddress,
          slp_address: response.slpAddress,
          pubkey: response.publicKey
        }
        // Create user
        this.$store.dispatch('wallet/createUser', wallet)
        this.routeTimer = setTimeout(() => {
          this.routeTimer = 0
          this.$router.push({ path: 'seed-phrase' })
        }, 3000)
      }).catch(error => {
        console.log('Error in creating wallet: ', error)
      })
    },
    readMore () {
      this.$refs.see_more.classList.add('hide-text')
      this.$refs.guide_phrase.classList.add('overflow-auto')
      if (this.notifier === true) {
        this.$q.notify({
          message: 'Scroll to read more...',
          color: 'notify-purelypeer',
          timeout: 1000,
          position: 'center'
        })
        this.notifier = false
      }
    }
  }
}
</script>

<style>
.carousel-style {
  position: fixed;
  height: 98%;
  box-shadow: none;
  overflow: auto;
}
.btn-proceed {
  background-color: #0AC18E;
  padding-left: 18px;
  padding-right: 18px;
  padding-top: 6px;
  padding-bottom: 2px;
}
.phrase {
  color: #8C908F;
}
.guide-phrase {
  position: relative;
  overflow: hidden;
  height: calc((32/100) * 100vh)
}
.text-control-color {
  color: #0AC18E;
}
.text-control-color-1 {
  color: rgba(10, 193, 142, .5);
}
.text-spinner-color {
  color: #0AC18E;
}
.see-more {
  position: absolute;
  line-height: 44px;
  width: 100%;
  bottom: 0pt;
  background-color: rgba(255,255,255,.8);
}
.read-more-text {
  color: #0AC18E;
  display: block;
}
.hide-text {
  display: none;
}
.overflow-auto {
  overflow: auto !important;
}
.bg-notify-purelypeer {
  background-color: #0AC18E;
}
.scroll {
  overflow: hidden;
}
</style>
