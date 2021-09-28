import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import store from './store'
import { vuetifyPlugin } from '@/plugins/vuetify'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.min.css'
import VuetifyMessage from '@lemonneko/vuetify-message'

Vue.config.productionTip = false

Vue.use(Vuetify)
Vue.use(VuetifyMessage)

new Vue({
  store,
  vuetify: vuetifyPlugin,
  render: h => h(App)
}).$mount('#app')
