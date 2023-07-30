<template>
  <form @submit="onSuccess"> <!-- //@submit="addUsercar" -->
    <card>
      <template slot="header">
        <h5 class="title">App Profile</h5>
      </template>
      <div class="row">
        <div class="col-md-12 text-left">
          <base-input label="namecar" placeholder="namecar" v-model="namecar">
          </base-input>
        </div>
      </div>

      <div class="row">
        <div class="col-md-12 text-left">
          <base-input label="Brand" v-model="Brand" placeholder="Brand">
          </base-input>
        </div>
      </div>

      <div class="row">
        <div class="col-md-12 text-left">
          <base-input label="Model" v-model="Model" placeholder="Model">
          </base-input>
        </div>
      </div>

      <div class="row">
        <div class="col-md-4 pr-md-1 text-left">
          <base-input label="Type" v-model="Type" placeholder="Type">
          </base-input>
        </div>
        <div class="col-md-4 px-md-1 text-left">
          <base-input label="Electric Energy Consumption" v-model="Energy" placeholder="Wh/km">
          </base-input>
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
import { ref } from 'vue'

export default {
  data() {
    return {
      namecar: '',
      Type: '',
      Brand: '',
      Model: '',
      Energy: '',
      email: '',
    }
  },
  created() {
    //this.createUser()
  },

  methods: {
    onSuccess(event) {
      this.createUser()
      event.preventDefault();
      alert("App")
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
        Energy: this.Energy,
        email: this.$store.state.email,
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
 