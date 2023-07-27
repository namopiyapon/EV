import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({

  getters: {
  },
  actions: {
  },
  modules: {
  },
  state () {
    return {
      email: '',
      isLoggedIn: false,
      namecar: {},
      id: 0,
    //   count: 0
    }
  },
  mutations: {
    login (state,email) {
      state.email=email;
    },
    setid (state,id) {
      state.id=id;
    },
    settext (state,text) {
      state.namecar[i]=text
      i++;
    }
    
  }
})

export default store;
// const app = createApp({ /* your root component */ })

// // Install the store instance as a plugin
// app.use(store)

