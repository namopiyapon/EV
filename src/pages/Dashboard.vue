<template >
  <div class="content">
    <card type="plain">

      <template slot="header">
        <h4 class="card-title">Google Maps</h4>
      </template>
      <div>
        <form @submit="onSuccess">
          <section>
            <div style="position: absolute; z-index: 1; margin-right: 5px">
              <div class="row">
                <div>
                  <input type="text" id="address" name="address" v-model="address">
                  <i class="tim-icons icon-compass-05" @click="locatorButtonPressed"></i>
                </div>
              </div>

              <div class="row" style="margin-right: 5px">
                <input type="text" id="addressto" name="addressto" v-model="addressto">
              </div>

              <div class="row">
                <div class="hide" id="div1">
                  <select v-model="myselect" id="myselect">
                    <option v-for="user in Usercar" :key="user.namecar" :value="user.ID">
                      {{ user.namecar }}
                    </option>
                  </select>
                </div>
                <div>
                  <form>
                    <input type="radio" name="typevalue" id="battery" value="battery" @click="show2" />battery<br>
                    <input type="radio" name="typevalue" id="distance" value="distance" @click="show1"
                      checked />distance<br>
                    <input type="text" id="value" name="value" v-model="value">
                  </form>
                </div>
                <div><button type="submit">Go</button></div>
              </div>
            </div>
          </section>
          <section>
            <div id="map" class="map"></div>
          </section>
        </form>
      </div>

    </card>
  </div>
</template>
<script>
import { Card } from "@/components/index";
import axios from 'axios';
import { collection, where, query, getDocs, getDoc, doc } from "firebase/firestore"
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
      value: '',
      Model: [],
      DrivingRange: '',
      radio1: false,
      radio2: false,
    };
  },
  components: {
    Card,
  },
  created() {
    this.getUsers();

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
        streetViewControl: false,
      }
      let map = new window.google.maps.Map(
        document.getElementById("map"),
        mapOptions);
      this.directionsRenderer.setMap(map);
      return map
    }
  },
  methods: {
    onSuccess(event) {
      this.route();
      event.preventDefault();

    },
    show1() {
      document.getElementById('div1').style.display = 'none';
    },
    show2() {
      document.getElementById('div1').style.display = 'block';
    },

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
    async route() {
      if (!this.originPlaceId || !this.destinationPlaceId || !this.value) {
        console.log("---")
        return;
      }

      // this.directionsService = new google.maps.DirectionsService();
      // this.directionsRenderer = new google.maps.DirectionsRenderer();

      // let myLatlng = new window.google.maps.LatLng(13.7563, 100.5018);
      // let mapOptions = {
      //   mapTypeControl: false,
      //   zoom: 9,
      //   mapId: '6fa16203b0a4dcbf',
      //   center: myLatlng,
      //   scrollwheel: false,
      //   streetViewControl: false,
      // }
      // let map = new window.google.maps.Map(
      //   document.getElementById("map"),
      //   mapOptions);
      // this.directionsRenderer.setMap(map);
      //----------------------------------firebase-----------------------------//
      this.radio1 = document.getElementById('battery');
      this.radio2 = document.getElementById('distance');
      if (this.radio1.checked) {
        console.log(this.radio1)
        const docSnap = await getDoc(doc(firebase.db, 'Usercar', document.getElementById("myselect").value))
        if (docSnap.exists()) {
          this.DrivingRange = docSnap.data().DrivingRange
        } else {
          console.log('Document does not exist')
        }
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
              radius: '1000',
              name: ['electric vehicle charging station', 'EA anywhere', 'Charging Station', 'PTT Charging Station', 'MG Super Charge Charging Station', 'EleXA Charging Station', 'EGAT Charging Station'],
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
    //-------------------------------CALLBACK--------------------------------//
    async callback(results, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          // console.log("----> ", results[i]);//---------------------------------------*****
          this.createMarker(results[i]);
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
                var distance = element.distance;
                var duration = element.duration;
                var from = origins[i];
                var to = destinations[j];
                // console.log("distance=> " + distance + "/ duration=>" + duration + "/ from=>" + from + "/ to=>" + to)
                resolve(distance);
              }
            }
          }
        }
      });
    },

    //-------------------------------createMarker--------------------------------//
    async createMarker(place) {

      if (!place.geometry || !place.geometry.location) return;

      const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");

      var color = await this.matrix(place);
      //--------------------------------this.value => battery-----------------------------------//
      if (this.radio1.checked) {
        var Driving = this.DrivingRange * (this.value / 100)
        if (Driving * 0.7 > color.value / 1000) {
          // console.log("value*0.7 > color " + color.value)
          var pinBackground = new PinElement({
            background: "#0cfb04",
            borderColor: "#089c03",
            glyphColor: "#089c03",
          });
        } else if (Driving > color.value / 1000) {
          // console.log("value > color " + color.value)
          var pinBackground = new PinElement({
            background: "#fb6f04",
            borderColor: "#b04d02",
            glyphColor: "#b04d02",
          });
        } else {
          // console.log("value*0.7 < color " + color.value)
          var pinBackground = new PinElement({
            background: "#fb0404",
          });
        }
      }
      //--------------------------------this.value => distance-----------------------------------//
      else if (this.radio2.checked) {
        if (this.value * 0.7 > color.value / 1000) {
          // console.log("value*0.7 > color " + color.value)
          var pinBackground = new PinElement({
            background: "#0cfb04",
            borderColor: "#089c03",
            glyphColor: "#089c03",
          });
        } else if (this.value > color.value / 1000) {
          console.log("value > color " + color.value)
          var pinBackground = new PinElement({
            background: "#fb6f04",
            borderColor: "#b04d02",
            glyphColor: "#b04d02",
          });
        } else {
          console.log("value*0.7 < color " + color.value)
          var pinBackground = new PinElement({
            background: "#fb0404",
          });
        }
      }

      //-----------------colorMarker--------------------//

      const marker = new AdvancedMarkerElement({
        map: this.map,
        position: place.geometry.location,
        content: pinBackground.element,
      });

      const infoWindow = new google.maps.InfoWindow({
        maxWidth: 300,
        ariaLabel: "Uluru",
      });
      marker.addListener("click", () => {
        infoWindow.close();
        infoWindow.setContent(contentString);
        infoWindow.open({
          anchor: marker,
          map,
        });
      });

      // google.maps.event.addListener(marker, "click", () => {
      //   infowindow.setContent(contentString || "");
      //   infowindow.open(this.map);
      // });

      // const infowindow = new google.maps.InfoWindow({
      //   content: contentString,
      //   maxWidth: 300,
      //   ariaLabel: "Uluru",
      // });
      // marker.addListener("click", () => {
      //   infoWindow.close();
      //   infowindow.open({
      //     anchor: marker,
      //     map,
      //   });
      // });

      // ----------------------------infowindow----------------------------------//
      var request = {
        query: place.name,
        fields: ['name', 'geometry', 'photos', 'formatted_address', 'types','info_messages'],
        locationBias: place.geometry.location,
      };


      var service = new google.maps.places.PlacesService(this.map);
      const info = await new Promise((resolve, reject) => {
        service.findPlaceFromQuery(request, function (results, status) {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
              const formataddress = results[i]
              console.log(results[i])
              resolve(formataddress);
            }
          }
        })
      });
      //----------------------------infowindow----------------------------------//
      var contentString =
        '<div id="content">' +
        '<div id="siteNotice">' +
        "</div>" +
        '<h5 id="firstHeading" class="firstHeading">' + place.name + '</h5>' +
        '<div id="bodyContent">' +
        '<p><b>ที่อยู่ :</b> ' + info.formatted_address + ' <br>' +
        '<b>ประเภท :</b> 1 => จำนวน 1 <br>' +
        '<b>ระยะทาง :</b> ' + color.text + ' <br>' +
        // info.photos +
        '<p><a href="https://www.google.com/maps/search/?api=1&query=' + place.geometry.location + '&query_place_id=' + place.place_id + '">' +
        'ดูใน Google Maps</a>' +
        '</div>' +
        '</div>';
      const photo = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=200&photo_reference=' + info.photo_reference
      '&key=AIzaSyCEwuKRd9Fqz_RCZoonrVZAbNuVzvrA8JU'
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

.hide {
  display: none;
}
</style>
