<template>
  <form @submit="onSuccess">
    <card class="cardcenter">
      <template slot="header">
        <h5 class="title">ข้อเสนอแนะ</h5>
      </template>
      <div class="row">
        <div class="col-md-12 text-left">
          <base-input label="หัวเรื่อง" placeholder="หัวเรื่อง" v-model="topic" required>
          </base-input>
        </div>
      </div>

      <div class="row">
        <div class="col-md-12 text-left">
          <base-input>
            <label>รายละเอียด</label>
            <textarea rows="4" cols="80" class="form-control" placeholder="" v-model="about"
              required>
          </textarea>
          </base-input>
        </div>
      </div>
      <template slot="footer">
        <button type="success" class="custom-button" fill>ส่ง</button>
      </template>
    </card>
  </form>
</template>
<script>
import { Card, BaseInput } from "@/components/index";
import BaseButton from "@/components/BaseButton";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore"
import firebase from './Firebase.js'

export default {
  data() {
    return {
      topic: '',
      about: '',
      email: '',
      user: null,
    }
  },
  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      this.user = user;
    });
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
  methods: {
    onSuccess(event) {
      this.createFeed()
      event.preventDefault();
      alert("Successful Feedback")
    },
    async createFeed() {
      if (this.user) {
        const colRef = collection(firebase.db, 'Feedback')
        const dataObj = {
          topic: this.topic,
          about: this.about,
          email: this.user.email,
        }
        // create document and return reference to it
        const docRef = await addDoc(colRef, dataObj)
        // access auto-generated ID with '.id'
        console.log('Document was created with ID:', docRef.id)
        this.topic = '';
        this.about = '';
      } else {
        console.error('User is not defined');
        // สามารถทำการจัดการข้อผิดพลาดเพิ่มเติมได้ตามที่คุณต้องการ
      }
    }

  },
};
</script>
<style></style>
