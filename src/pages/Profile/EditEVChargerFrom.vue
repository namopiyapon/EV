<template>
  <form @submit="onSuccess" @reset="ondelete">
    <!-- @submit="onSuccess" @reset="ondelete" -->
    <card>
      <template slot="header">
        <h5 class="title">Edit EV Charger</h5>
      </template>
      <div class="row">
        <div class="col-md-8 text-left">
          <base-input label="name pump" placeholder="name pump" id="namepump" name="namepump" v-model="namepump">
          </base-input>
        </div>
      </div>

      <div class="row">
        <div class="col-md-8 text-left">
          <base-input label="location" id="location" name="location" v-model="model.location" placeholder="location">
          </base-input>
        </div>
      </div>

      <div class="row">
        <div class="col-md-4 text-left">
          <base-input label="latitude" id="latitude" name="latitude" v-model="latitude" placeholder="latitude">
          </base-input>
        </div>
        <div class="col-md-4 text-left">
          <base-input label="longitude" id="longitude" name="longitude" v-model="longitude" placeholder="longitude">
          </base-input>
        </div>
      </div>

      <div class="row">
        <div class="col-md-4 text-left">
          <base-input label="type" v-model="type" placeholder="type">
          </base-input>
        </div>
        <div class="col-md-4 text-left">
          <base-input label="pcs" v-model="model.pcs" placeholder="pcs">
          </base-input>
        </div>
      </div>
      <div class="row">
        <div class="col-md-8 text-left">
          <base-input>
            <label>Details</label>
            <textarea rows="4" cols="80" class="form-control" placeholder="Here can be your description" v-model="about">
          </textarea>
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
import { collection, addDoc , doc, getDoc ,updateDoc, deleteDoc } from "firebase/firestore"
import firebase from './Firebase.js'
import BaseButton from "@/components/BaseButton";

export default {
  data() {
    return {
      namepump: '',
      latitude: '',
      longitude: '',
      place_id: '',
      type: '',
      pcs: '',
      about: '',
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
  mounted() {
    this.getCountry()
    //-------------------------------Autocomplete--------------------------------//
    const originInput = document.getElementById("location")

    let autocomplete = new google.maps.places.Autocomplete(
      originInput,
      {
        fields: ["place_id", "name", "geometry"],
      },
    );

    autocomplete.addListener("place_changed", () => {
      let place = autocomplete.getPlace();
      console.log(place)
      this.latitude = place.geometry.location.lat();
      this.longitude = place.geometry.location.lng();
      this.namepump = place.name;
      this.place_id = place.place_id;
    });
  },
  methods: {
    //-------------------------------------getCountry------------------------------------------//
    async getCountry() {
      const docSnap = await getDoc(doc(firebase.db, 'ChargingStation',  this.$store.state.idStation ));
      if (docSnap.exists()) {
        this.namepump = docSnap.data().name
        this.latitude = docSnap.data().lat
        this.longitude = docSnap.data().long
        this.model.pcs = docSnap.data().pcs
        this.type = docSnap.data().type
        this.about = docSnap.data().about
        this.place_id = docSnap.data().place_id
      } else {
        console.log('Document does not exist')
      }
      
    },
    //-----------------------------------APP------------------------------------//
    async onSuccess(event) {
      event.preventDefault();
      await updateDoc(doc(firebase.db, 'ChargingStation', this.$store.state.idStation), {
        name: this.namepump,
        lat: this.latitude,
        long: this.longitude,
        place_id: this.place_id,
        type: this.type,
        pcs: this.model.pcs,
        about: this.about,
      })
      this.$router.push('/editevcharger')
    },
    async ondelete(event) {
      console.log('delete =>',this.$store.state.idStation )
      event.preventDefault();
      await deleteDoc(doc(firebase.db, 'ChargingStation', this.$store.state.idStation));
      this.$router.push('/editevcharger')
    },

  }
};
</script>
<style></style>
