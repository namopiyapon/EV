import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({

  getters: {
  },
  actions: {
    setid (context,idname) {
      context.commit('idd', idname)
    }
  },
  modules: {
  },
  state () {
    return {
      email: '',
      idname: '',
      idtest: '',
    //   count: 0
    }
  },
  mutations: {
    login (state,email) {
      state.email=email;
    },
    SET_IDTEST(state, idtest) {
      state.idtest = idtest
    }

  }
})

export default store;
// const app = createApp({ /* your root component */ })

// // Install the store instance as a plugin
// app.use(store)

