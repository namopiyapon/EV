<template>
  <form @submit="onSuccess">
    <card class="cardcenter">
      <template slot="header">
        <h5 class="title">สมัครสมาชิก</h5>
      </template>
      <div class="row">
        <div class="col-md-12 text-left">
          <base-input id="email" type="email" label="E-mail" placeholder="E-mail" v-model="model.email" required>
          </base-input>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12 text-left">
          <base-input id="password" type="password" label="password" placeholder="password" v-model="model.password"
            required>
          </base-input>
        </div>
      </div>


      <template slot="footer">
        <!-- <base-button type="submit" variant="primary">Sign Up</base-button> -->
        <button type="submit" class="custom-button">สมัคร</button>
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


  methods: {
    async onSuccess(event) {
      event.preventDefault();
      try {
        const auth = getAuth();
        const credential = await createUserWithEmailAndPassword(auth, this.model.email, this.model.password);
        // alert('User registered:', credential.user);
        this.$router.push("/dashboard")
      } catch (error) {
        if (error.code === 'auth/weak-password') {
          this.error = 'รหัสผ่านที่ให้ไว้ไม่รัดกุมเกินไป';
        } else if (error.code === 'auth/email-already-in-use') {
          this.error = 'มีบัญชีสำหรับอีเมลนั้นอยู่แล้ว';
        } else {
          this.error = error.message;
        }
        alert('Error creating user:'+ this.error);
      }
    }

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
