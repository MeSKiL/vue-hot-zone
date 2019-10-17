import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

const SET_FILE = 'SET_FILE';

export default new Vuex.Store({
    state: {
        fileList:[]
    },
    mutations: {
        [SET_FILE](state,option){
            state.fileList = option
            console.log(state)
        }
    },
    getters:{
      fileList:state=>state.fileList
    },
    actions: {},
    plugins: debug ? [createLogger()] : []
})
