// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/css/chat.css'
import './assets/css/animation.css'
import vuePicturePreview from 'vue-picture-preview'
Vue.use(vuePicturePreview)

import axios from 'axios'
Vue.prototype.$ajax= axios




Vue.config.productionTip = false



/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
