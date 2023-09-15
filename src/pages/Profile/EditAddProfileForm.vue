<template>
  <form @submit="onSuccess"> <!-- //@submit="addUsercar" -->
    <card>
      <template slot="header">
        <h5 class="title">เพิ่มข้อมูลรถยนต์ไฟฟ้า</h5>
      </template>
      <div class="row">
        <div class="col-md-8 text-left">
          <base-input label="ชื่อรถ" placeholder="กรุณาตั้งชื่อรถยนต์ของคุณ" v-model="namecar" required>
          </base-input>
        </div>
      </div>

      <div class="row">
        <div class="col-md-8 text-left">
          <base-input label="แบรนด์" v-model="Brand" placeholder="กรุณาใช่ชื่อแบรนด์ของคุณ" required>
          </base-input>
        </div>
      </div>

      <div class="row">
        <div class="col-md-8 text-left">
          <base-input label="โมเดล" v-model="Model" placeholder="กรุณาใช่ชื่อโมเดลของคุณ" required>
          </base-input>
        </div>
      </div>

      <div class="row">
        <div class="col-md-4  text-left">
          <base-input label="ระยะทางสูงสุดที่วิ่งได้" v-model="DrivingRange" placeholder="กิโลเมตรต่อชั่วโมง"
            id="DrivingRange" required>
          </base-input>
        </div>
        <div class="col-md-4  text-left">
          ประเภทหัวชาร์จ<br>
          <select v-model="Type" id="Type">
            <option value="CCS">CCS2</option>
            <option value="type_2">type2</option>
            <option value="J1772">J1772</option>
          </select>
        </div>
      </div>

      <template slot="footer">
        <!-- <base-button type="success" fill>Save</base-button> -->
        <button type="submit" class="custom-button" fill>บันทึก</button>
      </template>
    </card>
  </form>
</template>
<script>

import { Card, BaseInput } from "@/components/index";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore"
import firebase from './Firebase.js'
import BaseButton from "@/components/BaseButton";
import { getAuth, onAuthStateChanged } from "firebase/auth";

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
      Usercar: [],
      num: 0,
      dataArray: [],
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
    async getUsers() {
      const auth = getAuth();
      const user = auth.currentUser;
      this.num = 0;
      if (!user) {
        return false; // ไม่มีผู้ใช้ล็อกอินอยู่
      }
      const q = query(collection(firebase.db, 'Usercar'), where('email', '==', this.user.email));
      const querySnap = await getDocs(q);

      this.Usercar = querySnap.docs.map((doc) => ({
        namecar: doc.data().namecar, // เลือกเฉพาะฟิล 'namecar'
      }));

      for (var i = 0; i < this.Usercar.length; i++) {
        if (this.Usercar[i].namecar == this.namecar) {
          this.num++;
        }
      }
      if (this.num > 0) {
        return false;
      } else {
        return true;
      }
    },
    async onSuccess(event) {
      const check = await this.getUsers();
      if (check) {
        this.createUser()
        // alert("ADD")
        this.$router.push("/profile")
      } else {
        alert('มีชื่อนี้อยู่แล้ว กรุณาเปลี่ยนชื่อ')
      }
      event.preventDefault();

    },
    async createUser() {
      console.log('-----')
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
 