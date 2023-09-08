<template>
  <form @submit="onSuccess">
    <card class="cardcenter">
      <template slot="header">
        <h5 class="title">Login</h5>
      </template>
      <div class="row">
        <div class="col-md-12 text-left">
          <base-input label="E-mail" type="email" placeholder="E-mail" v-model="form.email" required>
          </base-input>
        </div>
      </div>

      <div class="row">
        <div class="col-md-12 text-left">
          <base-input label="password" type="password" v-model="form.password" placeholder="password" required>
          </base-input>
        </div>
      </div>
      <template slot="footer">
        <button type="submit" class="custom-button">Login</button>
        <a href="/#/Register"> Register</a>
      </template>
    </card>
  </form>
</template>
<script>
import { Card, BaseInput } from "@/components/index";
import BaseButton from "@/components/BaseButton";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { cookies } from "@/components/index";


export default {


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
          //store
          this.$store.commit('login', this.form.email)
          // this.$cookies.set("email", this.form.email, 60*60);
          this.$router.push("/dashboard")
        })
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

<style>
.cardcenter {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: max-content;
  height: max-content;
  margin: 66px auto;
  /* ให้ขยับ card ไปอยู่ตรงกลางทั้งแนวนอนและแนวตั้ง */

  /* เพิ่มข้อมูลสำหรับมือถือ (หน้าจอขนาดเล็ก) */
  @media (max-width: 768px) {
    width: 90%;
    /* ให้ card มีความกว้าง 90% ของหน้าจอ */
  }
}
</style>
