import { createStore } from 'vuex'
import { setAuthHeader } from '@/Api'
import createPersistedState from 'vuex-persistedstate'

export const store = createStore({
    plugins: [createPersistedState({
        storage: window.sessionStorage,
    })],

    state: {
        auth_token: "",
        user_id: null
    },
    getters:{
        isAuthenticated: (state) => {
            return state.auth_token.length > 0
        }
    },
    mutations:{
        updateToken (state, newToken) {
            state.auth_token = newToken;
            setAuthHeader(newToken)
        },

        updateUser (state, userId) {
            state.user_id = userId;
        }
    },
    actions:{
        login ({ commit }, newToken) {
            commit('updateToken', newToken)
        },

        logout ({ commit }) {
            commit('updateToken', "")
        },
    }
});