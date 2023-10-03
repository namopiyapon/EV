<template>
  <form @submit="onSuccess" @reset="ondelete"> <!-- //@submit="addUsercar" -->
    <card>

      <div style="display: none">
        <!-- {{ getCountry() }} -->
      </div>
      <template slot="header">
        <h5 class="title">เพิ่มปั๊มชาร์จไฟฟ้า</h5>
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
        <p style= "padding-left: 15px;" >จำนวนหัวชาร์จ: </p><br>
      </div>

      <div class="row">
        <div class="col-md-2 text-left" v-for="(item, index) in types" :key="index">
          <label>{{ types[index] }}</label>
          <input type="text" class="custom-input" :value="numType[index]" :placeholder="types[index]"
            @input="updateNumType(index, $event)" @keydown="onKeyDown(index, $event)" required />
        </div>
      </div>

      <template slot="footer">
        <!-- <base-button type="success" fill>Save</base-button> -->
        <button type="submit" class="custom-button" fill>เผยแพร่</button>
        <button type="reset" class="custom-button" fill>ลบ</button>
      </template>
    </card>
  </form>
</template>
<script>

import { Card, BaseInput } from "@/components/index";
import { doc, getDoc, updateDoc, deleteDoc, query, collection, getDocs } from "firebase/firestore"
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
      user: null,
      userId: null,
      Usercar: [],
      num: 0,
      address: '',
      types: [],
      numType: [],
    }
  },
  // updated() {
  //   this.getCountry()
  // },

  mounted() {
    this.gettype();
    this.userId = this.$route.params.id;
    this.getCountry()
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
      this.user = user;
    });

  },

  methods: {
    updateNumType(index, event) {
      this.$set(this.numType, index, event.target.value);
    },
    onKeyDown(index, event) {
      const inputValue = event.target.value;

      // ตรวจสอบและอนุญาตเฉพาะตัวเลขและจุด (.) ในการป้อน
      if (
        // (event.key === "." && inputValue.indexOf(".") === -1) || // อนุญาตให้ป้อนจุด (.) ได้เพียงครั้งเดียว
        (event.key >= "0" && event.key <= "9") || // อนุญาตให้ป้อนตัวเลข
        event.key === "Backspace" || // อนุญาตให้ใช้ปุ่ม Backspace
        event.key === "Delete" || // อนุญาตให้ใช้ปุ่ม Delete
        event.key === "ArrowLeft" || // อนุญาตให้ใช้ปุ่มลูกศรซ้าย
        event.key === "ArrowRight" // อนุญาตให้ใช้ปุ่มลูกศรขวา
      ) {
        // อนุญาตให้ป้อนข้อมูล
      } else {
        event.preventDefault(); // ป้องกันการป้อนข้อมูลที่ไม่ถูกต้อง
      }
    },
    async gettype() {
      const q = query(collection(firebase.db, "type"));
      const querySnap = await getDocs(q);
      this.types = querySnap.docs.map((doc) => doc.data().type);
    },

    async getCountry() {
      const docSnap = await getDoc(doc(firebase.db, 'station', this.userId))
      if (docSnap.exists()) {
        this.Type = docSnap.data().Type
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
        Type: true,
        numType: this.numType,
      })
      console.log(this.numType)
      this.$router.push('/addstation')
    },
    async ondelete(event) {
      console.log('delete =>', this.userId)
      event.preventDefault();
      await deleteDoc(doc(firebase.db, 'station', this.userId));
      this.$router.push('/addstation')
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
.custom-input {
  width: 100%;
  /* กำหนดความกว้างให้เต็มพอดี */
  padding: 10px;
  /* กำหนดระยะห่างของข้อความใน input */
  border: 1px solid #ccc;
  /* กำหนดเส้นขอบ */
  border-radius: 4px;
  /* กำหนดมุมขอบเรียบ */
  font-size: 14px;
  /* กำหนดขนาดตัวอักษร */
}

/* สไตล์เมื่อ input ได้รับฟังก์ชัน focus */
.custom-input:focus {
  border-color: #007bff;
  /* เปลี่ยนสีเส้นขอบเมื่อได้รับฟังก์ชัน focus */
}
</style>
