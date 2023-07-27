<template>
  <form @submit="onSuccess" >
    <card>
      <template slot="header">
        <h5 class="title">Login</h5>
      </template>
      <div class="row">
        <div class="col-md-5 text-left">
          <base-input label="E-mail" type="email" placeholder="E-mail" v-model="form.email">
          </base-input>
          <!-- <input label="E-mail" type="email" placeholder="E-mail" v-model="form.email"> -->
        </div>
      </div>

      <div class="row">
        <div class="col-md-5 text-left">
          <base-input label="password" type="password" v-model="form.password" placeholder="password">
          </base-input>
          <!-- <input label="password" type="password" v-model="form.password" placeholder="password"> -->
        </div>
      </div>
      {{ form }}
      <template slot="footer">
        <button type="submit" >Login</button>
      </template>
    </card>
  </form>
</template>
<script>
import { Card, BaseInput } from "@/components/index";

import BaseButton from "@/components/BaseButton";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
export default {
  data(){
    return{
      form: {
        email: "",
        password: "",
      },
    };
  },
  // created(){
  //   const auth = geteAuth();
  //   onAuthStateChanged(auth,(user)=> {
  //     if(user){
  //       this.$router.push("/dashboard").catch(() => {});
  //     }
  //   });
  // },

  methods: {
    async onSuccess(event) {
      event.preventDefault();
      const auth = getAuth();
      alert("Login")
      console.log( this.form.email , '++++++++++++++++++++++++',this.form.password)
      signInWithEmailAndPassword(auth, this.form.email, this.form.password)

        .then(() => {
          this.$router.push("/dashboard").catch(() => { });
          //this.$store.commit('login', this.model.email)
        })
        .catch((error) => {
          alert(error.message);
        });
    },
  },
  components: {
    Card,
    BaseInput,
    BaseButton,
  },
  props: {
    model: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
};
</script>

<style></style>
