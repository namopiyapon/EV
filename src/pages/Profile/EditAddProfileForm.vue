<template>
  <form @submit="onSuccess"> <!-- //@submit="addUsercar" -->
    <card>
      <template slot="header">
        <h5 class="title">ADD Profile</h5>
      </template>
      <div class="row">
        <div class="col-md-8 text-left">
          <base-input label="namecar" placeholder="namecar" v-model="namecar" required>
          </base-input>
        </div>
      </div>

      <div class="row">
        <div class="col-md-8 text-left">
          <base-input label="Brand" v-model="Brand" placeholder="Brand" required>
          </base-input>
        </div>
      </div>

      <div class="row">
        <div class="col-md-8 text-left">
          <base-input label="Model" v-model="Model" placeholder="Model" required>
          </base-input>
        </div>
      </div>

      <div class="row">
        <div class="col-md-4  text-left">
          <base-input label="DrivingRange" v-model="DrivingRange" placeholder="Km(only number)" id="DrivingRange" required>
          </base-input>
        </div>
        <div class="col-md-4  text-left">
          Type<br>
          <select v-model="Type" id="Type">
            <option value="CCS">CCS</option>
            <option value="type_2">type2</option>
            <option value="J1772">J1772</option>
          </select>
        </div>
      </div>

      <template slot="footer">
        <!-- <base-button type="success" fill>Save</base-button> -->
        <button type="submit" fill>Save</button>
      </template>
    </card>
  </form>
</template>
<script>

import { Card, BaseInput } from "@/components/index";
import { collection, addDoc } from "firebase/firestore"
import firebase from './Firebase.js'
import BaseButton from "@/components/BaseButton";
import { getAuth ,onAuthStateChanged } from "firebase/auth";

export default {
  data() {
    return {
      namecar: '',
      Type: '',
      Brand: '',
      Model: '',
      DrivingRange: '',
      email: '',
      myselect: '',
      user: null,
    }
  },
  created() {
    //this.createUser()

  },
  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      this.user = user;
    });
    //---------------ตรวจสอบและอนุญาตเฉพาะตัวเลขและจุด (.) ในการป้อน-----------------------//
    const inputField = document.getElementById('DrivingRange');
    inputField.addEventListener('keydown', function (event) {
      const inputValue = inputField.value;

      // ตรวจสอบและอนุญาตเฉพาะตัวเลขและจุด (.) ในการป้อน
      if (
        (event.key === '.' && inputValue.indexOf('.') === -1) || // อนุญาตให้ป้อนจุด (.) ได้เพียงครั้งเดียว
        (event.key >= '0' && event.key <= '9') || // อนุญาตให้ป้อนตัวเลข
        event.key === 'Backspace' || // อนุญาตให้ใช้ปุ่ม Backspace
        event.key === 'Delete' || // อนุญาตให้ใช้ปุ่ม Delete
        event.key === 'ArrowLeft' || // อนุญาตให้ใช้ปุ่มลูกศรซ้าย
        event.key === 'ArrowRight' // อนุญาตให้ใช้ปุ่มลูกศรขวา
      ) {
        return true; // อนุญาตให้ป้อนข้อมูล
      } else {
        event.preventDefault(); // ป้องกันการป้อนข้อมูลที่ไม่ถูกต้อง
        return false; // ไม่อนุญาตให้ป้อนข้อมูลที่ไม่ถูกต้อง
      }
    });
  },

  methods: {
    onSuccess(event) {
      console.log(this.Type)
      this.createUser()
      event.preventDefault();
      alert("ADD")
      // this.$store.commit('settext', this.namecar)
      // console.log('->', this.$store.state.namecar)
      this.$router.push("/profile").catch(() => { })

        .catch((error) => {
          alert(error.message);
        });

    },
    async createUser() {
      // 'users' collection reference
      const colRef = collection(firebase.db, 'Usercar')
      // data to send
      const dataObj = {
        namecar: this.namecar,
        Type: this.Type,
        Brand: this.Brand,
        Model: this.Model,
        DrivingRange: this.DrivingRange,
        email: this.user.email,
      }
      // create document and return reference to it
      const docRef = await addDoc(colRef, dataObj)
      // access auto-generated ID with '.id'
      console.log('Document was created with ID:', docRef.id)
    }

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
 