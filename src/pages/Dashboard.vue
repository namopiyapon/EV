<template>
  <div class="content">
    <card type="plain">
      <template slot="header">
        <h4 class="card-title">Google Maps</h4>
      </template>
      <div>
        <section>
          <div style="position: relative; z-index: 1; " class="col-md-12 text-left">
            <input type="text" id="autocomplete" name="autocomplete" v-model="address"><i class="icon-refresh-02"
              @click="locatorButtonPressed"> </i><br>
            <input type="text" id="addressto" name="addressto" v-model="addressto"><br>
            <select v-model="myselect">
              <option v-for="user in Usercar" :key="user.namecar" :value="user.namecar">
                {{ user.namecar }}
              </option>
            </select>
          </div>
        </section>
        <section>
          <div id="map" class="map"></div>
        </section>
      </div>
    </card>
  </div>
</template>
<script>
import { Card } from "@/components/index";
import axios from 'axios';
import { collection, where, query, getDocs } from "firebase/firestore"
import firebase from '@/Firebase.js'

export default {
  data() {
    return {
      address: "",
      addressto: "",
      Usercar: [],
      id: [],
      myselect: ""
    };
  },
  components: {
    Card,
  },
  created() {
    this.getUsers()
  },
  methods: {
    locatorButtonPressed() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          this.getAddressFrom(position.coords.latitude, position.coords.longitude);
          this.showUserLocationOnTheMap(position.coords.latitude, position.coords.longitude);
          // console.log(position.coords.latitude + " /" + position.coords.longitude);
        },
          error => {
            console.log(error.message);
          }
        );
      } else {
        console.log("Your browser does not support geolocation API ");
      }
    },
    getAddressFrom(lat, long) {
      axios.get("https://maps.googleapis.com/maps/api/geocode/json?latlng="
        + lat +
        ","
        + long
        + "&key=AIzaSyCEwuKRd9Fqz_RCZoonrVZAbNuVzvrA8JU")
        .then(response => {
          if (response.data.error_message) {
            console.log(response.data.error_message);
          } else {
            this.address = response.data.results[0].formatted_address,
              console.log(response.data.results[0].formatted_address);
          }
        })
    },
    showUserLocationOnTheMap(latitude, longitude) {
      let map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: new google.maps.LatLng(latitude, longitude),
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });

      new google.maps.Marker({
        position: new google.maps.LatLng(latitude, longitude),
        map: map
      })
    },

    async getUsers() {

      const q = query(collection(firebase.db, 'Usercar'), where('email', '==', "mo@gmail.com")) //this.$store.state.email
      const querySnap = await getDocs(q);

      querySnap.forEach((doc) => {
        this.Usercar.push({ ID: doc.id, ...doc.data() })
        // console.log(doc.data());
      })
    },
  },

  mounted() {
    //autocomplete
    let autocomplete = new google.maps.places.Autocomplete(
      document.getElementById("autocomplete"),
      {
        bounds: new google.maps.LatLngBounds(
          new google.maps.LatLng(40.748817, -73.985428)
        )
      }
    );

    autocomplete.addListener("place_changed", () => {
      let place = autocomplete.getPlace();
      console.log(place)
      this.showUserLocationOnTheMap(
        place.geometry.location.lat(), place.geometry.location.lng());
    });

    let autocomplete2 = new google.maps.places.Autocomplete(
      document.getElementById("addressto"),
      {
        bounds: new google.maps.LatLngBounds(
          new google.maps.LatLng(40.748817, -73.985428)
        )
      }
    );

    autocomplete2.addListener("place_changed", () => {
      let place = autocomplete2.getPlace();
      console.log(place)
      this.showUserLocationOnTheMap(
        place.geometry.location.lat(), place.geometry.location.lng());
    });

      //Set map
      let myLatlng = new window.google.maps.LatLng(13.7563, 100.5018);
      let mapOptions = {
        zoom: 9,
        center: myLatlng,
        scrollwheel: false,
      }
      let map = new window.google.maps.Map(
        document.getElementById("map"),
        mapOptions
      );


  },
};
</script>
<style>
#infowindow-content .title {
  font-weight: bold;
}

#infowindow-content {
  display: none;
}

#map #infowindow-content {
  display: inline;
}

.pac-icon {
  display: none;
}

.pac-item {
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
}

.pac-item:hover {
  background-color: #ececec;
}

#map {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
</style>
