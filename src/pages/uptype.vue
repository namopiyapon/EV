<template>
  <form>
    <card class="cardcenter">
      <template slot="header">
        <h5 class="title">อัพไฟล์ ประเภทหัวชาร์จ</h5>
      </template>
      <div class="row">
        <div class="col-md-12 text-center">
          <label>เลือกไฟล์ .txt: </label><br>
          <input id="myfile" type="file" accept=".txt" required>
        </div>
      </div>
      <template slot="footer">
        <button type="button" @click="readFile" class="custom-button">บันทึก</button> <br>
      </template>
    </card>
  </form>
</template>
<!-- <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCEwuKRd9Fqz_RCZoonrVZAbNuVzvrA8JU&libraries=geometry,places&v=weekly"></script> -->
<script>
import { Card, BaseInput } from "@/components/index";
import BaseButton from "@/components/BaseButton";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { cookies } from "@/components/index";
import { collection, addDoc, deleteDoc, getDocs } from "firebase/firestore"
import firebase from '@/Firebase.js'


export default {
  data() {
    return {
      user: null,
    };
  },
  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      this.user = user;
    });
    // console.log(textData);
  },

  methods: {
    readFile() {
      const inputFile = document.getElementById('myfile');
      const file = inputFile.files[0];
      if (!file) {
        alert('กรุณาเลือกไฟล์ .txt ก่อน');
        return;
      }
      var r = confirm("คุณต้องการบันทึกข้อมูลใหม่ใช่หรือไม่ ถ้าใช่ข้อมูลเก่าของคุณจะถูกลบถาวร");
      if (r) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target.result;
          const dataArray = content.split(',');
          this.processDataArray(dataArray);
        };
        reader.readAsText(file);
      }
      else {
        this.$router.push('/uptype')
      }

    },
    async processDataArray(dataArray) {
      const colRef = collection(firebase.db, 'type');
      // ลบข้อมูลเก่าทั้งหมดในคอลเลกชัน 'type'
      const querySnapshot = await getDocs(colRef);
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
        console.log('Document with ID', doc.id, 'was deleted.');
      });
      // เพิ่มข้อมูลใหม่จาก dataArray
      for (let i = 0; i < dataArray.length; i++) {
        const dataObj = {
          type: dataArray[i], // ใช้ key 'type' สำหรับเก็บข้อมูล
        };

        try {
          const docRef = await addDoc(colRef, dataObj);
          console.log('Document was created with ID:', docRef.id);
        } catch (error) {
          console.error('Error creating document:', error);
        }
      }
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