<template>
  <div class="content">
    <card type="plain">
      <template slot="header">
        <h4 class="card-title">Google Maps</h4>
      </template>
      <div>
        <section>
          <div style="position: relative; z-index: 1;" class="col-md-12 text-left">
            <input type="text" id="address" name="address" v-model="address"><i class="tim-icons icon-compass-05"
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
      Stationtest: [],
      Station: [],
      id: [],
      myselect: "",
      originPlaceId: "",
      originlocstion: "",
      destinationPlaceId: "",
      service: "",
      infowindow: "",
      waypoints: [],
      geopoint: [],
      formataddress: [],
    };
  },
  components: {
    Card,
  },
  created() {
    this.getUsers();
    // this.getStation();
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
        mapId: '6fa16203b0a4dcbf',
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
          // window.alert("Please select an option from the dropdown list.  " + place.place_id);
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
            const polyline = require('google-polyline')//----polyline
            this.waypoints = polyline.decode(response.routes[0].overview_polyline);//----polyline
            // console.log("1).----" + this.waypoints)
          } else {
            window.alert("Directions request failed due to " + status);
          }
          //--------------------------------polyline----------------------------------//
          // const PolygonCoords = this.PolygonPoints();
          // const PolygonBound = new google.maps.Polygon({
          //   paths: PolygonCoords,
          //   strokeColor: "#FF0000",
          //   strokeOpacity: 0.8,
          //   strokeWeight: 2,
          //   fillColor: "#FF0000",
          //   fillOpacity: 0.35,
          // });
          // // to hide polygon set strokeOpacity and fillColor = 0
          // PolygonBound.setMap(this.map);
          const service = new google.maps.places.PlacesService(this.map);
          for (let j = 0; j < this.waypoints.length; j += 40) {

            service.nearbySearch({
              location: { lat: this.waypoints[j][0], lng: this.waypoints[j][1] },
              radius: '500',
              name: ['EA anywhere', 'Charging Station', 'PTT Charging Station', 'MG Super Charge Charging Station', 'EleXA Charging Station', 'EGAT Charging Station'],
            }, this.callback);
          }
        },
      );
    },
    //-------------------------------PolygonArray--------------------------------//
    PolygonArray(latitude) {
      const R = 6378137;
      const pi = 3.14;
      //distance in meters
      const upper_offset = 100;
      const lower_offset = -100;
      const Lat_up = upper_offset / R;
      const Lat_down = lower_offset / R;
      //OffsetPosition, decimal degrees
      const lat_upper = latitude + (Lat_up * 180) / pi;
      const lat_lower = latitude + (Lat_down * 180) / pi;
      return [lat_upper, lat_lower];
    },
    //-------------------------------PolygonPoints--------------------------------//
    PolygonPoints() {
      let polypoints = this.waypoints
      let PolyLength = polypoints.length;
      let UpperBound = [];
      let LowerBound = [];
      for (let j = 0; j <= PolyLength - 1; j++) {
        let NewPoints = this.PolygonArray(polypoints[j][0]);
        UpperBound.push({ lat: NewPoints[0], lng: polypoints[j][1] });
        LowerBound.push({ lat: NewPoints[1], lng: polypoints[j][1] });

      }
      let reversebound = LowerBound.reverse();
      let FullPoly = UpperBound.concat(reversebound);
      return FullPoly;
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
              this.originPlaceId = results[0].place_id;
              this.originlocstion = results[0].geometry.location;
              // window.alert("Please select an option from the dropdown list.  " + results[0].place_id);
            }
          });
          //------------------------
        })

    },
    //-------------------------------SHOW MARKER--------------------------------//

    showUserLocationOnTheMap(latitude, longitude) {

      const infowindow = new google.maps.InfoWindow({
        content: latitude + ", " + longitude,
        ariaLabel: "Uluru",
      });
      const marker = new google.maps.Marker({
        position: new google.maps.LatLng(latitude, longitude),
        map: this.map
      });
      marker.addListener("click", () => {
        infowindow.open({
          anchor: marker,
          map,
        });
      });

    },

    //-------------------------------SHOW FIREBASE--------------------------------//
    async getUsers() {
      const q = query(collection(firebase.db, 'Usercar'), where('email', '==', "mo@gmail.com")) //this.$store.state.email
      const querySnap = await getDocs(q);
      querySnap.forEach((doc) => {
        this.Usercar.push({ ID: doc.id, ...doc.data() })
        // console.log(doc.data());
      })
    },
    //-----------------------------------
    // async getStation() {
    //   this.Stationtest.push('0')
    //   //-----------------
    //   let polypoints = this.waypoints
    //   let PolyLength = polypoints.length;
    //   let UpperBound = [];
    //   let LowerBound = [];
    //   for (let j = 0; j <= PolyLength - 1; j++) {
    //     let NewPoints = this.PolygonArray(polypoints[j][0]);
    //     UpperBound.push({ lat: NewPoints[0], lng: polypoints[j][1] });
    //     LowerBound.push({ lat: NewPoints[1], lng: polypoints[j][1] });

    //     // filter to get users with 'dob' after 1990
    //     const q = query(collection(firebase.db, 'ChargingStation'), where('lat', '<=', NewPoints[0]), where('lat', '>=', NewPoints[1]));// 
    //     const querySnap = await getDocs(q);

    // querySnap.forEach((doc) => {
    //   for (let i = 0; i < this.Stationtest.length; i++) {
    //     // console.log(this.Stationtest[i]+"!="+ doc.data().name);
    //     if (this.Stationtest[0] == '0') {
    //       this.Stationtest.pop();
    //       // console.log("this.Stationtest[0] => "+this.Stationtest[0]);
    //     }
    //     if (this.Stationtest[i] != doc.data().name) {
    //       this.Station.push(doc.data())
    //       this.Stationtest.push(doc.data().name)
    //       this.showUserLocationOnTheMap(doc.data().lat, doc.data().long);
    //       console.log("doc.data().name => "+doc.data().name);
    //     }

    //   }
    // })
    // console.log("0:>"+NewPoints[0] + "," + polypoints[j][1]);
    // console.log("1:>"+NewPoints[1] + "," + polypoints[j][1]);
    // }


    // },


    //-------------------------------CALLBACK--------------------------------//
    callback(results, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          // console.log("----> ", results[i]);//---------------------------------------*****
          this.createMarker(results[i], i);
        }
      }
    },
    //---------------------------------------Matrix------------------------------------------//
    matrix(place) {
      // build request
      const origin1 = place.geometry.location;
      const origin2 = place.name;
      const destinationA = this.address;
      const destinationB = this.originlocstion;
      var service = new google.maps.DistanceMatrixService();
      return new Promise((resolve, reject) => {
        service.getDistanceMatrix(
          {
            origins: [origin1, origin2],
            destinations: [destinationA, destinationB],
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.METRIC,
            avoidHighways: false,
            avoidTolls: false,
          }, callback);
        function callback(response, status) {
          if (status == 'OK') {
            var origins = response.originAddresses;
            var destinations = response.destinationAddresses;

            for (var i = 0; i < origins.length; i++) {
              var results = response.rows[i].elements;
              for (var j = 0; j < results.length; j++) {
                var element = results[j];
                var distance = element.distance.value;
                // var duration = element.duration.text;
                // var from = origins[i];
                // var to = destinations[j];
                // console.log("distance=> " + distance + "/ duration=>" + duration + "/ from=>" + from + "/ to=>" + to)
                resolve(distance / 1000);
              }
            }
          }
        }
      });
    },

    //-------------------------------createMarker--------------------------------//
    async createMarker(place, i) {
      if (!place.geometry || !place.geometry.location) return;
      const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");
      var color = await this.matrix(place);
      Usercar.ID.Energy
      //-----------------colorMarker--------------------//
      const pinBackground = new PinElement({
        background: "#FBBC04",
      });
      const marker = new AdvancedMarkerElement({
        map: this.map,
        position: place.geometry.location,
        content: pinBackground.element,
      });
      google.maps.event.addListener(marker, "click", () => {
        infowindow.setContent(contentString || "");
        infowindow.open(this.map);
      });

      const infowindow = new google.maps.InfoWindow({
        content: contentString,
        ariaLabel: "Uluru",
      });
      marker.addListener("click", () => {
        infowindow.open({
          anchor: marker,
          map,
        });
      });

      var request = {
        query: place.name,
        fields: ['name', 'geometry', 'photos', 'business_status', 'formatted_address'],
        locationBias: place.geometry.location,
      };
      
      

      // ----------------------------editformataddress----------------------------------//
      var service = new google.maps.places.PlacesService(this.map);
      const myPromise = new Promise((resolve, reject) => {
        service.findPlaceFromQuery(request, function (results, status) {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
              const formataddress = results[i].formatted_address
              resolve(formataddress);
              //  createMarker(results[i]);
            }
          }
        })
      });
      //----------------------------editformataddress----------------------------------//
      console.log(myPromise);
      var contentString =
        '<div id="content">' +
        '<div id="siteNotice">' +
        "</div>" +
        '<h5 id="firstHeading" class="firstHeading">' + place.name + '</h5>' +
        '<div id="bodyContent">' +
        '<p><b>' + place.name + '</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
        'sandstone rock formation in the southern part of the ' +
        'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) ' +
        'south west of the nearest large town, Alice Springs; 450&#160;km ' +
        '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major ' +
        'features of the Uluru - Kata Tjuta National Park. Uluru is ' +
        'sacred to the Pitjantjatjara and Yankunytjatjara, the ' +
        'Aboriginal people of the area. It has many springs, waterholes, ' +
        'rock caves and ancient paintings. Uluru is listed as a World ' +
        'Heritage Site.</p>' +
        '<p>Attribution: Uluru, <a href="https://www.google.com/maps/search/?api=1&query=' + place.geometry.location + '&query_place_id=' + place.place_id + '">' +
        'https://www.google.com/maps/search/?api=1&query=' + place.geometry.location + '&query_place_id=' + place.place_id + '</a>' +
        '<br>' + place.adr_address + '</p>' +
        '</div>' +
        '</div>';
    },
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

*/ .pac-icon {
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
}</style>
