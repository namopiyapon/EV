<template>
  <form @submit="onSuccess" @reset="ondelete"> <!-- //@submit="addUsercar" -->
    <card>

      <div style="display: none">
        <!-- {{ getCountry() }} -->
      </div>
      <template slot="header">
        <h5 class="title">Edit Profile</h5>
      </template>
      <div class="row">
        <div class="col-md-8 text-left">
          <!-- <p>name car : {{ Energy }}</p>  -->
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
          <select v-model="Type" id="Type" required>
            <option value="CCS">CCS</option>
            <option value="type_2">type2</option>
            <option value="J1772">J1772</option>
          </select>
        </div>
      </div>

      <template slot="footer">
        <!-- <base-button type="success" fill>Save</base-button> -->
        <button type="submit" fill>Save</button>
        <button type="reset" fill>delete</button>
      </template>
    </card>
  </form>
</template>
<script>

import { Card, BaseInput } from "@/components/index";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore"
import firebase from './Firebase.js'
import BaseButton from "@/components/BaseButton";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default {
  props: [
    'model'

  ],
  data() {
    return {
      namecar: '',
      Type: '',
      Brand: '',
      Model: '',
      DrivingRange: '',
      email: '',
      user: null,
    }
  },
  // updated() {
  //   this.getCountry()
  // },

  mounted() {
    this.getCountry()
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
    async getCountry() {
      const docSnap = await getDoc(doc(firebase.db, 'Usercar', this.$store.state.idtest))
      if (docSnap.exists()) {
        this.namecar = docSnap.data().namecar
        this.Type = docSnap.data().Type
        this.Brand = docSnap.data().Brand
        this.Model = docSnap.data().Model
        this.DrivingRange = docSnap.data().DrivingRange
      } else {
        console.log('Document does not exist')
      }

    },
    async onSuccess(event) {
      event.preventDefault();
      await updateDoc(doc(firebase.db, 'Usercar', this.$store.state.idtest), {
        namecar: this.namecar,
        Type: this.Type,
        Brand: this.Brand,
        Model: this.Model,
        DrivingRange: this.DrivingRange,
      })
      this.$router.push('/profile')
    },
    async ondelete(event) {
      console.log('delete =>', this.$store.state.idtest)
      event.preventDefault();
      await deleteDoc(doc(firebase.db, 'Usercar', this.$store.state.idtest));
      this.$router.push('/profile')
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
