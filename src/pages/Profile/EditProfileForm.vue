<template>
 <form @submit="onSuccess" @reset="ondelete" >  <!-- //@submit="addUsercar" -->
    <card>
      <template slot="header">
        <h5 class="title">Edit Profile</h5>
      </template>
      <div class="row">
        <div class="col-md-12 text-left">
          <!-- <p>name car : {{ Energy }}</p>  -->
          <base-input label="namecar" placeholder= "namecar" v-model="namecar">
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
          <base-input label="Electric Energy Consumption" v-model="Energy"
            placeholder="Wh/km">
          </base-input>
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
import { doc, getDoc ,updateDoc, deleteDoc} from "firebase/firestore"
import firebase from './Firebase.js'
import BaseButton from "@/components/BaseButton";

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
  mounted() {
    this.getCountry()
  },
  
  methods: {
    async getCountry() {
      const docSnap = await getDoc(doc(firebase.db, 'Usercar',  this.$store.state.idtest ))
      if (docSnap.exists()) {
        this.namecar = docSnap.data().namecar
        this.Type = docSnap.data().Type
        this.Brand = docSnap.data().Brand
        this.Model = docSnap.data().Model
        this.Energy = docSnap.data().Energy
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
        Energy: this.Energy,
      })
      this.$router.push('/profile')
    },
    async ondelete(event) {
      console.log('delete =>',this.$store.state.idtest )
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
