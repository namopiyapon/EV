<template>
  <form @submit="onSuccess">
    <card>
      <template slot="header">
        <h5 class="title">Login</h5>
      </template>
      <div class="row">
        <div class="col-md-5 text-left">
          <base-input label="E-mail" type="email" placeholder="E-mail" v-model="form.email">
          </base-input>
        </div>
      </div>

      <div class="row">
        <div class="col-md-5 text-left">
          <base-input label="password" type="password" v-model="form.password" placeholder="password">
          </base-input>
        </div>
      </div>
      <template slot="footer">
        <button type="submit">Login</button> <br>
        <a href="/#/Register" >   Register</a>
      </template>
    </card>
  </form>
</template>
<script>
import { Card, BaseInput } from "@/components/index";
import BaseButton from "@/components/BaseButton";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {cookies} from "@/components/index";


export default  {

  
  mounted() {
    
  },
  data() {
    return {
      form: {
        email: "",
        password: "",
      },
    };
  },

  methods: {
    async onSuccess(event) {
      event.preventDefault();
      const auth = getAuth();
      alert("Login")
      signInWithEmailAndPassword(auth, this.form.email, this.form.password)
        .then(() => {
          //session
          // this.$session.start()
          // this.$session.set('email', this.form.email)
          // console.log('keyemail => ',this.$session.get('email'),'ID => ', this.$session.id())
          //cookies
          // this.cookies.set("email", this.form.email, 60*60);
          // console.log(this.cookies.get("email"));

          //store
          this.$store.commit('login', this.form.email)
          // this.$cookies.set("email", this.form.email, 60*60);
          this.$router.push("/dashboard").catch(() => { });
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
    cookies,
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
