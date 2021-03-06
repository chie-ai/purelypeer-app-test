import Vue from 'vue'
import Vuex from 'vuex'

// import example from './module-example'

import wallet from './wallet'
import cashdrop from './cashdrop'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

const vm = new Vue()
const userID = localStorage.getItem('user_id')
const connectWS = () => {
  console.log('Connected')
  vm.$connect(`wss://${process.env.socketUrl}/${userID}/`,
    {
      format: 'json',
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000
    })
}
const disconnectWS = () => {
  console.log('Socket disconnected')
  vm.$disconnect()
}

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      // example
      wallet,
      cashdrop
    },

    // vue native websocket
    state: {
      socket: {
        isConnected: false,
        message: '',
        reconnectError: false
      }
    },
    mutations: {
      SOCKET_ONOPEN (state, event) {
        Vue.prototype.$socket = event.currentTarget
        state.socket.isConnected = true
        console.log('Connection open')
      },
      SOCKET_ONCLOSE (state, event) {
        console.log('Socket close')
        state.socket.isConnected = false
      },
      SOCKET_ONERROR (state, event) {
        console.error(state, event)
      },
      // default handler called for all methods
      SOCKET_ONMESSAGE (state, message) {
        state.socket.message = message
      },
      // mutations for reconnect methods
      SOCKET_RECONNECT (state, count) {
        console.info(state, count)
      },
      SOCKET_RECONNECT_ERROR (state) {
        state.socket.reconnectError = true
      }
    },
    actions: {
      connectWebSocket: function () {
        connectWS()
      },
      disconnectWebSocket: function () {
        disconnectWS()
      },
      sendMessage: function (context, message) {
        console.log('Sent')
        Vue.prototype.$socket.send(message)
      }
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEBUGGING
  })

  return Store
}
