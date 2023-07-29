<template>
 <form >  <!-- //@submit="addUsercar" -->
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
      </template>
    </card>
  </form>
</template>
<script>

import { Card, BaseInput } from "@/components/index";
import { doc, getDoc } from "firebase/firestore"
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
    }
  },
  mounted() {
    this.getCountry()

  //  console.log(firebase.db)
  },
  
  methods: {
    // async add(event) {
    //   event.preventDefault();
    //   this.$store.dispatch('setid', user.namecar )
    //   console.log(this.$store.state.id,'*******************')
    // },
    
    async getCountry() {
      const docSnap = await getDoc(doc(firebase.db, 'Usercar', 'NmykRAp0E1v9QhZiEhpK'))
      
      if (docSnap.exists()) {
        // assign document fields
        // to data properties
        this.namecar = docSnap.data().namecar
        this.Type = docSnap.data().Type
        this.Brand = docSnap.data().Brand
        this.Model = docSnap.data().Model
        this.Energy = docSnap.data().Energy
      } else {
        console.log('Document does not exist')
      }
      
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
