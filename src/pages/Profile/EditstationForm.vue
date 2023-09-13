<template>
  <form @submit="onSuccess" @reset="ondelete"> <!-- //@submit="addUsercar" -->
    <card>

      <div style="display: none">
        <!-- {{ getCountry() }} -->
      </div>
      <template slot="header">
        <h5 class="title">แก้ไขปั๊มชาร์จไฟฟ้า</h5>
      </template>
      <div class="row">
        <div class="col-md-8 text-left">
          <!-- <p>name car : {{ Energy }}</p>  -->
          <base-input label="ชื่อ" placeholder="name" v-model="name" disabled="disabled">
          </base-input>
        </div>
      </div>

      <div class="row">
        <div class="col-md-8 text-left">
          <!-- <p>name car : {{ Energy }}</p>  -->
          <base-input label="ที่อยู่" placeholder="address" v-model="address" disabled="disabled">
          </base-input>
        </div>
      </div>

      <div class="row">
        <div class="col-md-4 text-left">
          <base-input label="ละติจูด" v-model="lat" placeholder="lat" disabled="disabled">
          </base-input>
        </div>
        <div class="col-md-4 text-left">
          <base-input label="ลองติจูด" v-model="lng" placeholder="lng" disabled="disabled">
          </base-input>
        </div>
      </div>

      <div class="row">
        <div class="col-md-8 text-left">
          <base-input label="url" v-model="url" placeholder="url" disabled="disabled">
          </base-input>
        </div>
      </div>

      <div class="row">
        <div class="col-md-2  text-left">
          <base-input label="CCS" v-model="CCS" placeholder="CCS" id="CCS" class="ccs-input" required>
          </base-input>
        </div>
        <div class="col-md-2  text-left">
          <base-input label="type_2" v-model="Type_2" placeholder="Type_2" id="Type_2" class="ccs-input" required>
          </base-input>
        </div>
        <div class="col-md-2  text-left">
          <base-input label="J1772" v-model="J1772" placeholder="J1772" id="J1772" class="ccs-input" required>
          </base-input>
        </div>
      </div>

      <template slot="footer">
        <!-- <base-button type="success" fill>Save</base-button> -->
        <button type="submit" class="custom-button" fill>บันทึก</button>
        <button type="reset" class="custom-button" fill>ลบ</button>
      </template>
    </card>
  </form>
</template>
<script>

import { Card, BaseInput } from "@/components/index";
import { doc, getDoc, updateDoc, deleteDoc, query, collection, where, getDocs } from "firebase/firestore"
import firebase from './Firebase.js'
import BaseButton from "@/components/BaseButton";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default {
  props: [
    'model'

  ],
  data() {
    return {
      name: '',
      Type: '',
      url: '',
      lng: '',
      lat: '',
      CCS: '',
      Type_2: '',
      J1772: '',
      user: null,
      userId: null,
      Usercar: [],
      num: 0,
      address: '',
    }
  },
  // updated() {
  //   this.getCountry()
  // },

  mounted() {
    this.userId = this.$route.params.id;
    this.getCountry()
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
      this.user = user;
    });

    //---------------ตรวจสอบและอนุญาตเฉพาะตัวเลขและจุด (.) ในการป้อน-----------------------//
    const inputFields = document.querySelectorAll('.ccs-input');

    inputFields.forEach(inputField => {
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
    });
  },

  methods: {

    async getCountry() {
      const docSnap = await getDoc(doc(firebase.db, 'station', this.userId))
      if (docSnap.exists()) {
        this.Type_2 = docSnap.data().Type_2
        this.Type = docSnap.data().Type
        this.J1772 = docSnap.data().J1772
        this.CCS = docSnap.data().CCS
        this.name = docSnap.data().name
        this.lat = docSnap.data().lat
        this.lng = docSnap.data().lng
        this.url = docSnap.data().url
        this.address = docSnap.data().address
      } else {
        console.log('Document does not exist')
      }

    },
    async onSuccess(event) {
      event.preventDefault();
      await updateDoc(doc(firebase.db, 'station', this.userId), {
        Type_2: this.Type_2,
        Type: true,
        J1772: this.J1772,
        CCS: this.CCS,
      })
      this.$router.push('/station')
    },
    async ondelete(event) {
      console.log('delete =>', this.userId)
      event.preventDefault();
      await deleteDoc(doc(firebase.db, 'station', this.userId));
      this.$router.push('/station')
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
<style>
</style>
