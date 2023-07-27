<template>
  <form @submit="onSuccess" @reset="onReset">
    <card>
      <template slot="header">
        <h5 class="title">Register</h5>
      </template>
      <div class="row">
        <div class="col-md-6 text-left">
          <base-input id="email" type="email" label="E-mail" placeholder="E-mail" v-model="model.email">
          </base-input>
        </div>
      </div>
      <div class="row"> 
        <div class="col-md-6 text-left">
          <base-input id="password" type="password" label="password" placeholder="password" v-model="model.password">
          </base-input>
        </div>
      </div>
      

      <template slot="footer">
        <!-- <base-button type="submit" variant="primary">Sign Up</base-button> -->
        <button type="submit">Sign Up</button>
        <button type="reset">reset</button>
      </template>

    </card>
  </form>
</template>
<script>

import { Card, BaseInput } from "@/components/index";

import BaseButton from "@/components/BaseButton";
// import { getAuth,createUserWithEmailAndPassword,onAuthStateChanged, } from "firebase/auth";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
export default {
  components: {
    Card,
    BaseInput,
    BaseButton,
  },
  props: {
    model: {
      type: Object,
      default: () => {
        return {
        };
      },
    },
  },
  data() {
    return {
      form: {
        email: "",
        password: "",
      },
    };
  },
  created(){
  },
  mounted() {
    console.log( this.model.email , '++++++++++++++++++++++++',this.model.password)
  },
  methods: {
    onSuccess(event) {
      event.preventDefault();
      const auth = getAuth();
      alert("Register")
      console.log( this.model.email , '++++++++++++++++++++++++',this.model.password)
      createUserWithEmailAndPassword(auth, this.model.email, this.model.password)
      
        .then(async (userCredential) => {
          //await updateProfile(userCredential.username, { displayName: this.model.username });
          this.$router.push("/dashboard").catch(() => { });
          
        })
        .catch((error) => {
          alert(error.message);
        });

        //this.$store.commit('login', this.model.email)
    },
    onReset(event) {
      
      event.preventDefault();
      this.model.email = "";
      this.model.password = "";
      alert("Reset");
    },
  },

};
</script>
<style></style>
