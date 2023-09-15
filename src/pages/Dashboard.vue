<template >
  <div class="contentmap">
    <card type="plain">
      <div class="img">
        <img src="./img/A.png" width="25" height="30" /> ตำแหน่งเริ่มต้น ,
        <img src="./img/B.png" width="25" height="30" /> ตำแหน่งปลายทาง <br>
        ระยะทางหมุด : 
        <img src="./img/green.png" width="30" height="30" /> น้อยกว่า 70% ,
        <img src="./img/orange.png" width="30" height="30" /> มากกว่า 70% แต่ไม่เกิน 100% ,
        <img src="./img/red.png" width="30" height="30" /> มากกว่า 100% ,
        <img src="./img/grey.png" width="30" height="30" /> ไม่มีหัวชาร์ที่ตรงกัน
      </div>

      <!-- <template slot="header">
        <h4 class="card-title">Google Maps</h4>
      </template> -->
      <div>
        <form>
          <section>
            <div style="position: absolute; z-index: 1; " class="pac-card" id="pac-card">

              <div class="pac-controls">
                <input type="radio" name="typevalue" id="battery" value="battery"
                  @change="updatePlaceholder" /><b>แบตเตอร์รี่</b>
                <input type="radio" name="typevalue" id="distance" value="distance" checked
                  @change="updatePlaceholder" /><b>ระยะทาง</b><br>
                <input type="text" id="value" name="value" v-model="value" :placeholder="placeholder">
                <button type="submit" @click="onSuccess">Go</button>
              </div><br>

              <div>
                <b>ชื่อรถ:</b>
                <select v-model="myselect" id="myselect">
                  <option v-for="user in Usercar" :key="user.namecar" :value="user.ID">
                    {{ user.namecar }}
                  </option>
                </select>
              </div><br>

              <div class="row" id="pac-container">
                <div class="input-group">
                  <input type="text" id="address" name="address" v-model="address" placeholder="สถานที่เริ่มต้น">
                  <i class="tim-icons icon-compass-05" @click="locatorButtonPressed"></i>
                </div>
                <input type="text" id="addressto" name="addressto" v-model="addressto" placeholder="จุดหมายปลายทาง">
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
<!-- <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCEwuKRd9Fqz_RCZoonrVZAbNuVzvrA8JU&libraries=geometry,places&v=weekly"></script> -->
<script>
import { Card } from "@/components/index";
import axios from 'axios';
import { collection, where, query, getDocs, getDoc, doc, setDoc } from "firebase/firestore"
import firebase from '@/Firebase.js'
import { getAuth, onAuthStateChanged } from "firebase/auth";

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
      currentInfoWindow: null,
      copymarks: [],
      station: [],
      placeholder: '',
      CCS2: '',
      Type: '',
      Type_2: '',
      Typemycar: '',
      sumType: [],
      user: null,
      types: [],
      numtypes: [],
      nametypes: [],
    };
  },
  components: {
    Card,
  },
  created() {
    this.getUsers();
  },
  computed: {
    getPlaceholder() {
      // คำนวณค่า placeholder โดยอ้างอิงถึง radio1 และ radio2
      if (this.radio1 && this.radio1.checked) {
        console.log(this.radio1 + "this.radio1")
        return 'Km ที่วิ่งได้';
      } else if (this.radio2 && this.radio2.checked) {
        console.log(this.radio2 + "this.radio2")
        return '% แบตที่เหลือ';
      } else {
        return ''; // หรือค่าอื่น ๆ ที่คุณต้องการให้มีในกรณีอื่น ๆ
      }
    },
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
    async gettype() {
      const q = query(collection(firebase.db, 'type'))
      const querySnap = await getDocs(q);
      querySnap.forEach((doc) => {
        this.types.push(doc.data().type)
      })
    },

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
        return;
      }
      //----------------------------------firebase-----------------------------//
      this.resetmarkes();

      const docSnap = await getDoc(doc(firebase.db, 'Usercar', document.getElementById("myselect").value))
      if (docSnap.exists()) {
        this.DrivingRange = docSnap.data().DrivingRange
        this.Typemycar = docSnap.data().Type
      } else {
        console.log('Document does not exist mycar')
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
      if (this.user) {
        const q = query(collection(firebase.db, 'Usercar'), where('email', '==', this.user.email))
        const querySnap = await getDocs(q);
        querySnap.forEach((doc) => {
          this.Usercar.push({ ID: doc.id, ...doc.data() });
          // console.log(doc.data());
        })
      }
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
            origins: [destinationB, destinationA],
            destinations: [origin1, origin2],
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
      await this.getstation(place);
      console.log(this.types + "***")
      //--------------------------------this.value => battery-----------------------------------//
      var Driving;
      var pinBackground;
      if (this.radio1.checked) {
        Driving = this.DrivingRange * (this.value / 100)
        if (this.Type == true) { //updeat แล้ว
          for (var i = 0; i < this.types.length; i++) {
            if ((this.Typemycar == this.nametypes[i]) && (numtypes[i] > 0)) {
              if (Driving * 0.7 > color.value / 1000) {
                pinBackground = new PinElement({
                  background: "#0cfb04",
                  borderColor: "#089c03",
                  glyphColor: "#089c03",
                });
                break;
              } else if (Driving > color.value / 1000) {
                pinBackground = new PinElement({
                  background: "#fb6f04",
                  borderColor: "#b04d02",
                  glyphColor: "#b04d02",
                });
                break;
              } else {
                pinBackground = new PinElement({
                  background: "#fb0404",
                });
                break;
              }
            } else {
              pinBackground = new PinElement({
                background: "#6b6b6b",
                borderColor: "#8a8a8a",
                glyphColor: "#8a8a8a",
              });
              break;
            }
          }
        } else { //อื่นๆ 
          if (Driving * 0.7 > color.value / 1000) {
            pinBackground = new PinElement({
              background: "#0cfb04",
              borderColor: "#089c03",
              glyphColor: "#089c03",
            });
          } else if (Driving > color.value / 1000) {
            pinBackground = new PinElement({
              background: "#fb6f04",
              borderColor: "#b04d02",
              glyphColor: "#b04d02",
            });
          } else {
            pinBackground = new PinElement({
              background: "#fb0404",
            });
          }
        }
      }
      //--------------------------------this.value => distance-----------------------------------//
      else if (this.radio2.checked) {
        console.log("this.types.length " + this.types.length)
        if (this.Type == true) {
          for (var i = 0; i < this.types.length; i++) {
            console.log(this.Typemycar + "==" + this.nametypes[i] + " && " + this.numtypes[i] + "> 0")
            if ((this.Typemycar == this.nametypes[i]) && (this.numtypes[i] > 0)) {
              if (this.value * 0.7 > color.value / 1000) {
                pinBackground = new PinElement({
                  background: "#0cfb04",
                  borderColor: "#089c03",
                  glyphColor: "#089c03",
                });
              } else if (this.value > color.value / 1000) {
                pinBackground = new PinElement({
                  background: "#fb6f04",
                  borderColor: "#b04d02",
                  glyphColor: "#b04d02",
                });
              } else {
                pinBackground = new PinElement({
                  background: "#fb0404",
                });
              }
            } else {
              pinBackground = new PinElement({
                background: "#6b6b6b",
                borderColor: "#8a8a8a",
                glyphColor: "#8a8a8a",
              });
            }
          }
        } else {
          if (this.value * 0.7 > color.value / 1000) {
            // console.log("value*0.7 > color " + color.value)
            pinBackground = new PinElement({
              background: "#0cfb04",
              borderColor: "#089c03",
              glyphColor: "#089c03",
            });
          } else if (this.value > color.value / 1000) {
            pinBackground = new PinElement({
              background: "#fb6f04",
              borderColor: "#b04d02",
              glyphColor: "#b04d02",
            });
          } else {
            pinBackground = new PinElement({
              background: "#fb0404",
            });
          }
        }

      }

      //-----------------colorMarker--------------------//

      const marker = new AdvancedMarkerElement({
        map: this.map,
        position: place.geometry.location,
        content: pinBackground.element,
      });
      this.copymarks.push(marker);

      // ----------------------------infowindow----------------------------------//
      marker.addListener("click", async () => {
        if (this.currentInfoWindow) {
          this.currentInfoWindow.close();
        }
        const infoWindow = new google.maps.InfoWindow({
          maxWidth: 300,
          ariaLabel: "Uluru",
        });
        await this.getstation(place);
        // console.log('this.Type' + this.Type)
        if (this.Type) {
          var contentString1 =
            '<div id="content">' +
            '<h5 id="firstHeading" class="firstHeading">' + place.name + '</h5>' +
            '<div id="bodyContent">' +
            '<div ><p><b>ที่อยู่ :</b> ' + info.formatted_address + ' <br></div>' +
            '<div class="left"><img src="https://maps.googleapis.com/maps/api/streetview?size=100x100&location=' + location + '&heading=' + heading + '&pitch=' + pitch + '&key=' + apiKey + '" alt="Street View Image" >' +
            '<b>ระยะทาง :</b> ' + color.text + ' </div><br>';

          for (var i = 0; i < this.numtypes.length; i++) {
            contentString1 += '<div><b>' + this.nametypes[i] + ' => </b> ' + this.numtypes[i] + ' <br>';
          }

          // '<div class="left" ><b>this.nameType[0] => </b> ' + this.numType[0] + ' <br>' +
          // '<b>this.nameType[0] => </b> ' + this.numType[1] + ' <br>' +
          // '<b>this.nameType[0] => </b> ' + this.numType[2] + ' <br><br></div>' +

          contentString1 +=
            '<div class="left"><p><a  target ="_blank" href="' + info.url + '">' +
            'ดูใน Google Maps</a></div >' +

            '</div>' +
            '</div>';
          infoWindow.setContent(contentString1);
        } else {
          infoWindow.setContent(contentString2);
        }
        infoWindow.open({ anchor: marker, map, })
        this.currentInfoWindow = await infoWindow;
        // console.log('-----> ', this.currentInfoWindow, this.currentInfoWindow.shouldFocus)
        //---------------------------ADD firebase-----------------------------------------//
        var addButton = document.getElementById('add-data');
        if (addButton) {
          // เพิ่มอีเวนต์ click listener
          addButton.addEventListener('click', async () => {
            // โค้ดที่ควรทำงานเมื่อปุ่มถูกคลิก
            const colRef = doc(firebase.db, 'station', place.place_id)
            const dataObj = {
              name: place.name,
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
              url: info.url,
              Type: false,
              nameType: this.types,
              address: info.formatted_address,
            }
            // เพิ่มเอกสารใหม่ในคอลเล็กชัน 'station'
            const docRef = await setDoc(colRef, dataObj)
            alert("ADD" + this.types);
          });
        }
      });

      var request = {
        placeId: place.place_id,
        fields: ['photos', 'formatted_address', 'url'],
      };
      //-------------------------------------------getphotos-----------------------------------------------//

      const apiKey = 'AIzaSyCEwuKRd9Fqz_RCZoonrVZAbNuVzvrA8JU';
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const location = lat + ',' + lng; // เปลี่ยน LATITUDE และ LONGITUDE เป็นพิกัดที่ต้องการ
      const heading = 0; // เปลี่ยนค่า heading ตามต้องการ
      const pitch = 0; // เปลี่ยนค่า pitch ตามต้องการ
      //--------------------------------------------------------------------


      var service = new google.maps.places.PlacesService(this.map);
      const info = await new Promise((resolve, reject) => {
        service.getDetails(request, (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            // console.log(place)
            const formataddress = place
            resolve(formataddress);
          }
        })
      });

      var contentString2 =
        '<div id="content">' +
        '<h5 id="firstHeading" class="firstHeading">' + place.name + '</h5>' +
        '<div id="bodyContent">' +
        '<div ><p><b>ที่อยู่ :</b> ' + info.formatted_address + ' <br></div>' +
        '<div class="left"><img src="https://maps.googleapis.com/maps/api/streetview?size=100x100&location=' + location + '&heading=' + heading + '&pitch=' + pitch + '&key=' + apiKey + '" alt="Street View Image" >' +
        '<b>ระยะทาง :</b> ' + color.text + ' </div><br>' +

        '<div class="left" > ยังได้อัปเดทข้อมูลกรุณาคลิก UPDATE เพื่อแจ้งแอดมิน <br></div>' +
        `<div class="left"><button type="button" id="add-data" >ADD DATA</button></div>` +

        '<div class="left"><p><a  target ="_blank" href="' + info.url + '">' +
        'ดูใน Google Maps</a></div >' +
        '</div>' +
        '</div>';
    },
    //--------------------------------------resetmarkes------------------------------------//
    resetmarkes() {
      for (var i = 0; i < this.copymarks.length; i++) {
        this.copymarks[i].setMap(null);
      }
      this.copymarks = []; // เคลียร์อาร์เรย์ markers
    },

    //---------------------------get firebase-----------------------------------------//
    async getstation(place) {
      const docSnap = await getDoc(doc(firebase.db, 'station', place.place_id))
      // console.log("place.place_id"+ place.place_id)
      if (docSnap.exists()) {
        this.Type = docSnap.data().Type;
        this.nametypes = docSnap.data().nameType; 
        this.numtypes = docSnap.data().numType; 
        // console.log(this.nametypes + "/" + this.numtypes)
        // for (var i = 0; i < nameType.length; i++) {
        //   sumType[i] = nameType[i];
        // }
        // console.log('sumType = ' + sumType)
      } else {
        // console.log('Document does not exist')
        this.Type = false;
      }
    },
    updatePlaceholder() {
      // คำนวณค่า `placeholder` จากค่าของ radio1 และ radio2
      if (this.radio2 && this.radio2.checked) {
        this.placeholder = 'Km ที่วิ่งได้';
      } else if (this.radio1 && this.radio1.checked) {
        this.placeholder = '% แบตที่เหลือ';
      } else {
        this.placeholder = ''; // หรือค่าอื่น ๆ ที่คุณต้องการให้มีในกรณีอื่น ๆ
      }
    },
  },

  mounted() {
    this.gettype();
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.user = user;
        await this.getUsers(); // เรียกใช้งาน getUsers() เมื่อมีผู้ใช้ล็อกอิน
      } else {
        // ไม่มีผู้ใช้ล็อกอิน ให้ทำอย่างอื่นที่ต้องการ
      }
    });
    //-----------user------------//
    this.radio1 = document.getElementById('battery');
    this.radio2 = document.getElementById('distance');
    this.updatePlaceholder();
    //---------------ตรวจสอบและอนุญาตเฉพาะตัวเลขและจุด (.) ในการป้อน-----------------------//
    const inputField = document.getElementById('value');
    inputField.addEventListener('keydown', function (event) {
      const inputValue = inputField.value;

      // ตรวจสอบและอนุญาตเฉพาะตัวเลขและจุด (.) ในการป้อน
      if (
        (event.key === '.' && inputValue.indexOf('.') === -1) || // อนุญาตให้ป้อนจุด (.) ได้เพียงครั้งเดียว
        (event.key >= '0' && event.key <= '9') || // อนุญาตให้ป้อนตัวเลข
        event.key === 'Backspace' || // อนุญาตให้ใช้ปุ่ม Backspace
        event.key === 'Delete' || // อนุญาตให้ใช้ปุ่ม Delete
        event.key === 'ArrowLeft' || // อนุญาตให้ใช้ปุ่มลูกศรซ้าย
        event.key === 'ArrowRight' // อนุญาตให้ใช้ปุ่มลูกศรขวา
      ) {
        return true; // อนุญาตให้ป้อนข้อมูล
      } else {
        event.preventDefault(); // ป้องกันการป้อนข้อมูลที่ไม่ถูกต้อง
        return false; // ไม่อนุญาตให้ป้อนข้อมูลที่ไม่ถูกต้อง
      }
    });
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

  },

};
</script>
<style>
/* ปรับแต่งสไตล์ของ .input-group */
.input-group {
  position: relative;
  margin-bottom: 10px;
}

/* ปรับแต่งสไตล์ของ icon ด้านขวาของ input */
.tim-icons.icon-compass-05 {
  font-size: 20px;
  position: absolute;
  top: 50%;
  right: 25px;
  transform: translateY(-50%);
  cursor: pointer;
  /* เพิ่ม pointer cursor เมื่อเอาเมาส์ไปวางที่ icon */
}

/* ปรับแต่งสไตล์ของ input */
#address {
  padding-right: 35px;
  width: 100%;
  font-size: 14px;
  padding: 5px 10px;
  /* ปรับแต่ง padding และ font-size */
  border: none;
  border-radius: 4px;
  background-color: #f1f1f1;
  margin-right: 20px;
  margin-left: 20px;

}

#addressto {
  padding-right: 35px;
  width: 100%;
  font-size: 14px;
  padding: 5px 10px;
  /* ปรับแต่ง padding และ font-size */
  border: none;
  border-radius: 4px;
  background-color: #f1f1f1;
  margin-right: 20px;
  margin-left: 20px;
}

/* ปรับแต่งสไตล์ของปุ่ม Go */
.pac-controls button {
  margin-top: 10px;
  background-color: #007BFF;
  color: #fff;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}

.pac-controls button:hover {
  background-color: #0056b3;
}

/* ปรับแต่งสไตล์ของ input และ select ใน #pac-container */
.pac-controls input[type="text"] {
  padding-right: 35px;
  width: 70%;
  font-size: 14px;
  padding: 5px 10px;
  /* ปรับแต่ง padding และ font-size */
  border: none;
  border-radius: 4px;
  background-color: #f1f1f1;
  margin-right: 5px;
}

#pac-container select {
  width: 100%;

}

/* ปรับแต่งสไตล์ของ .pac-card */
.pac-card {
  /* background-color: #fff; */
  border: 0;
  border-radius: 2px;
  box-shadow: 0 1px 4px -1px rgba(0, 0, 0, 0.5);
  margin: 5px;
  font: 400 18px Roboto, Arial, sans-serif;
  font-family: Roboto;
  padding: 2px 5px;
  font-size: 13px;
  width: 180px;
  /* ปรับความกว้างตามที่คุณต้องการ */

}

/* ปรับแต่งสไตล์ของ select */
select {
  border: none;
  border-radius: 4px;
  background-color: #f1f1f1;
  width: 100px;
  margin-left: 5px;
}

.left {
  text-align: left;
  float: left;
  margin-left: 5px;
  width: 120px;
}

.contentmap {
  margin-top: 66px;
  /* แก้ไขค่าตามที่คุณต้องการ */
}

.img {
  text-align: left;
  margin-left: 5px;
  margin-left: 5px;
}
</style>
