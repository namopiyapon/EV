<template>
  <div class="content">
    <card type="plain">
      <template slot="header">
        <h4 class="card-title">Google Maps</h4>
      </template>
      <div>
        <section>
          <div style="position: relative; z-index: 1;" class="col-md-12 text-left">
            <input type="text" id="address" name="address" v-model="address"><i class="icon-refresh-02"
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
      myselect: "",
      originPlaceId: "",
      destinationPlaceId: "",
      service: "",
      infowindow: "",
    };
  },
  components: {
    Card,
  },
  created() {
    this.getUsers()
  },
  computed: {
    //-------------------------------SHOW MAP--------------------------------//
    map() {
      this.directionsService = new google.maps.DirectionsService();
      this.directionsRenderer = new google.maps.DirectionsRenderer();
      let myLatlng = new window.google.maps.LatLng(13.7563, 100.5018);
      let mapOptions = {
        mapTypeControl: false,
        zoom: 9,
        center: myLatlng,
        scrollwheel: false,
      }
      let map = new window.google.maps.Map(
        document.getElementById("map"),
        mapOptions);
      this.directionsRenderer.setMap(map);
      return map
    }
  },
  methods: {
    //-------------------------------SHOW ROUTE--------------------------------//

    setupPlaceChangedListener(originAutocomplete, mode) {
      originAutocomplete.bindTo("bounds", this.map);
      originAutocomplete.addListener("place_changed", () => {
        const place = originAutocomplete.getPlace();

        if (!place.place_id) {
          window.alert("Please select an option from the dropdown list.");
          return;
        }

        if (mode === "ORIG") {
          this.originPlaceId = place.place_id;
          window.alert("Please select an option from the dropdown list.  " + place.place_id);
        } else {
          this.destinationPlaceId = place.place_id;
          // window.alert("Please select an option from the dropdown list.  "+ place.place_id);
        }

        this.route();
      });
    },
    route() {
      if (!this.originPlaceId || !this.destinationPlaceId) {
        return;
      }

      const me = this;

      this.directionsService.route(
        {
          origin: { placeId: this.originPlaceId },
          destination: { placeId: this.destinationPlaceId },
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (response, status) => {
          if (status === "OK") {
            me.directionsRenderer.setDirections(response);
          } else {
            window.alert("Directions request failed due to " + status);
          }
        },
      );
    },
    //-------------------------------Button CurrentPosition--------------------------------//

    locatorButtonPressed() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          this.getAddressFrom(position.coords.latitude, position.coords.longitude);
          // this.showUserLocationOnTheMap(position.coords.latitude, position.coords.longitude);
        },
          error => {
            console.log(error.message);
          }
        );
      } else {
        console.log("Your browser does not support geolocation API ");
      }
    },

    //-------------------------------KEY--------------------------------//
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
            this.address = response.data.results[0].formatted_address;
            // console.log(this.address);
          }
          //-----------------------
          const request = {
            query: this.address,
            fields: ["place_id", "name", "geometry"],

          };
          const service = new google.maps.places.PlacesService(this.map);
          service.findPlaceFromQuery(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
              // for (let i = 0; i < results.length; i++) {
              //   console.log("----> ", results[i]);
              //   this.createMarker(results[i]);
              // }
              // this.map.setCenter(results[0].geometry.location);
              this.originPlaceId = results[0].place_id;
              // window.alert("Please select an option from the dropdown list.  " + results[0].place_id);
            }
          });

          //------------------------
        })

    },
    //-------------------------------SHOW MARKER--------------------------------//

    showUserLocationOnTheMap(latitude, longitude) {

      new google.maps.Marker({
        position: new google.maps.LatLng(latitude, longitude),
        map: this.map
      });

    },

    //-------------------------------SHOW firebase Usercar--------------------------------//
    async getUsers() {

      const q = query(collection(firebase.db, 'Usercar'), where('email', '==', "mo@gmail.com")) //this.$store.state.email
      const querySnap = await getDocs(q);

      querySnap.forEach((doc) => {
        this.Usercar.push({ ID: doc.id, ...doc.data() })
        console.log(doc.data());
      })
    },

    //-------------------------------CALLBACK--------------------------------//
    callback(results, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          console.log("----> ", results[i]);
          this.createMarker(results[i]);
        }
      }
    },
    createMarker(place) {
      if (!place.geometry || !place.geometry.location) return;

      const marker = new google.maps.Marker({
        map: this.map,
        position: place.geometry.location,
      });

      google.maps.event.addListener(marker, "click", () => {
        infowindow.setContent(place.name || "");
        infowindow.open(this.map);
      });
    }
  },

  mounted() {
    //-------------------------------Autocomplete--------------------------------//
    const originInput = document.getElementById("address")
    const destinationInput = document.getElementById("addressto")

    let originAutocomplete = new google.maps.places.Autocomplete(
      originInput,
      { fields: ["place_id"] },
    );

    // originAutocomplete.addListener("place_changed", () => {
    //   let place = originAutocomplete.getPlace();
    //   console.log(place)
    //   this.showUserLocationOnTheMap(
    //     place.geometry.location.lat(), place.geometry.location.lng());
    // });

    let destinationAutocomplete = new google.maps.places.Autocomplete(
      destinationInput,
      { fields: ["place_id"] },
    );
    this.setupPlaceChangedListener(originAutocomplete, "ORIG");
    this.setupPlaceChangedListener(destinationAutocomplete, "DEST");
    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(originInput);
    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(destinationInput);

    // destinationAutocomplete.addListener("place_changed", () => {
    //   let place = destinationAutocomplete.getPlace();
    //   console.log(place)
    //   this.showUserLocationOnTheMap(
    //     place.geometry.location.lat(), place.geometry.location.lng());

    // });

    //callback restaurant map
    let myLatlng = new window.google.maps.LatLng(13.7563, 100.5018);

    var request = {
      location: myLatlng,
      radius: 500,
      type: 'restaurant'
    };

    const service = new google.maps.places.PlacesService(this.map);
    // service.nearbySearch(request, this.callback);

  },

};
</script>
<style>
/* #infowindow-content .title {
  font-weight: bold;
}

#infowindow-content {
  display: none;
}

#map #infowindow-content {
  display: inline;
} */

/* .pac-icon {
  display: none;
}

.pac-item {
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
}

.pac-item:hover {
  background-color: #ececec;
} */

#map {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
</style>
