import Vue from 'vue'
import App from './App.vue'
import 'ant-design-vue/dist/antd.css'
import store from './store'

Vue.config.productionTip = false;

new Vue({
    store,
    render: function (h) {
        return h(App)
    },
}).$mount('#app')
