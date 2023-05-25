import { createStore } from "vuex";
import axios from "axios";
/* eslint-disable */
const store = createStore({
    state: {
        remoteurl: 'http://localhost:2020/',
        user: Object,
        lastmessage: Object,
        allunreadmessage: {},
    },
    mutations: {
        setUnread(state, newValue) {
            if( !state.allunreadmessage[newValue.name] ) {
                state.allunreadmessage[newValue.name] = [ newValue.data ] 
            } else {
                var isalreadyExist = state.allunreadmessage[newValue.name].filter(e => {
                    if( JSON.stringify(e._id) == JSON.stringify(newValue.data._id) )
                    return e;
                })
                if( isalreadyExist.length == 0)
                state.allunreadmessage[newValue.name].push(newValue.data)
            }
            console.log(JSON.stringify(state.allunreadmessage) )
        },
        removeUnread(state, newValue) {
            if( state.allunreadmessage[newValue])
            state.allunreadmessage[newValue] = []
        },
        setUser(state, newValue) {
            state.user = newValue
        },
        setLastmessage(state, newValue) {
            state.lastmessage = newValue
        },
        updateLastmessage(state, newValue) {
            state.lastmessage[newValue.name] = newValue.msg
        },
        setPhone(state, newValue) {
            state.user.phone = newValue
        },
        setEmail(state, newValue) {
            state.user.email = newValue
        },
        updateChat(state, newValue) {
            state.user.chats = newValue
        },
        setOfflineMessage( state, newValue) {
            state.allunreadmessage = newValue
        },
    },
    actions: {
        setLastmessage({ commit, state }) {
            axios.get(`${state.remoteurl}getlastmsg/${state.user.username}`)
                .then(res => {
                    if (res.data.status == 'success') commit( 'setLastmessage' ,res.data.data)
                    else console.log(res.data)
                }).catch(err => {
                    console.log(err)
                })
        },
        updateChat({ commit, state }) {
            axios.get(`${state.remoteurl}userchat/${state.user.username}`)
                .then(res => {
                    if (res.data.status == 'success') commit( 'updateChat' ,res.data.data[0].chats)
                    else console.log(res.data)
                }).catch(err => {
                    console.log(err)
                })
        },
        setOfflineMessage({ commit, state }) {
            axios.get(`${state.remoteurl}offlinemessage/${state.user.username}`)
                .then(res => {
                    if (res.data.status == 'success') commit( 'setOfflineMessage' ,res.data.data)
                    else console.log(res.data)
                }).catch(err => {
                    console.log(err)
                })
        }
    },
    getters: {

    },
    modules: {

    }
})

export default store