import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

const SET_FILE = 'SET_FILE';
const SET_ZONE = 'SET_ZONE';
const CLEAN_ZONE = 'CLEAN_ZONE';
const SET_ZONE_URL_AND_REMARK  = 'SET_ZONE_URL_AND_REMARK';
const DELETE_ZONE = 'DELETE_ZONE';

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
        [SET_ZONE_URL_AND_REMARK](state,options){
            let obj = state.innerZoneList[findItem(state.innerZoneList,options)];
            if(obj){
                obj.url = options.url;
                obj.remark = options.remark;
                obj.other = options.other;
            }else{
                state.innerZoneList.push(options)
            }
        },
        [DELETE_ZONE](state,options){
            console.log(options.zoneId)
            let idx = findItem(state.innerZoneList,options);
            console.log(idx)
            if(idx<0) return;
            state.innerZoneList.splice(findItem(state.innerZoneList,options),1)
        }
    },
    getters: {
        fileList: state => state.fileList,
        innerZoneList: state => state.innerZoneList
    },
    actions: {},
    plugins: debug ? [createLogger()] : []
})

const findItem = (list,options) => {
    return list.findIndex(item => {
        return item.zoneId === options.zoneId
    })
};
