import Vue from 'vue'
import Vuex from 'vuex'
import cookies from "@/components/index";

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
      // console.log(Vue.$cookies.get());
      state.email=email;
      
    },
    SET_IDTEST(state, idtest) {
      state.idtest = idtest
    }

  },
  components: {
    cookies,
  },
})

export default store;




