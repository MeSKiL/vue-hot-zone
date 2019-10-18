import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

const SET_FILE = 'SET_FILE';
const SET_ZONE = 'SET_ZONE';
const CLEAN_ZONE = 'CLEAN_ZONE';

export default new Vuex.Store({
    state: {
        fileList: [],
        innerZoneList: []
    },
    mutations: {
        [SET_FILE](state, option) {
            state.fileList = option
        },
        [SET_ZONE](state, option) {
            state.innerZoneList = state.innerZoneList.concat(option)
        },
        [CLEAN_ZONE](state) {
            state.innerZoneList = []
        },
    },
    getters: {
        fileList: state => state.fileList,
        innerZoneList: state => state.innerZoneList
    },
    actions: {},
    plugins: debug ? [createLogger()] : []
})
