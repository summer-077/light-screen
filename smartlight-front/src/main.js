import Vue from 'vue'
import App from './App.vue'
import router from './router'
import dataV from '@jiaminghi/data-view'
import BaiduMap from 'vue-baidu-map'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import axios from './axios'
import scroll from 'vue-seamless-scroll'
import socketApi from "./websocket/websocket.js";

Vue.prototype.$socketApi = socketApi; //websocket 挂在原型上
Vue.use(scroll)

Vue.prototype.$http = axios
Vue.use(dataV)
Vue.use(ElementUI);



Vue.config.productionTip = false
Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: 'kbCrylk0oByz3HHfWBztgaEg0MVAtTtv'
})




new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
