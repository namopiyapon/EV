<template>
  <div class="content">
    <card type="plain">
      <template slot="header">
        <h4 class="card-title">Google Maps</h4>
      </template>
      <div>
        <section>
          <div style="position: relative; z-index: 1;">
            <input type="text" id="autocomplete" name="autocomplete" v-model="address"><i class="icon-refresh-02"
              @click="locatorButtonPressed"> </i><br>
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

export default {
  data() {
    return {
      address: ""
    };
  },
  components: {
    Card,
  },
  methods: {
    locatorButtonPressed() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          this.getAddressFrom(position.coords.latitude, position.coords.longitude);
          this.showUserLocationOnTheMap(position.coords.latitude, position.coords.longitude);
          console.log(position.coords.latitude+" /" + position.coords.longitude);
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
    showUserLocationOnTheMap(latitude,longitude){
      let map = new google.maps.Map(document.getElementById("map"),{
        zoom: 15,
        center: new google.maps.LatLng(latitude,longitude),
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });

      new google.maps.Marker({
        position: new google.maps.LatLng(latitude,longitude),
        map:map
      })
    }
  },
  mounted() {
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
        place.geometry.location.lat(),place.geometry.location.lng());
    });

    let myLatlng = new window.google.maps.LatLng(13.7563, 100.5018);
    let mapOptions = {
      zoom: 9,
      center: myLatlng,
      scrollwheel: false, //we disable de scroll over the map, it is a really annoing when you scroll through page
    }
    let map = new window.google.maps.Map(
      document.getElementById("map"),
      mapOptions
    );

    // To add the marker to the map, call setMap();
    // marker.setMap(map);
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
  top:0;
  right: 0;
  bottom: 0;
  left: 0;
}
</style>
