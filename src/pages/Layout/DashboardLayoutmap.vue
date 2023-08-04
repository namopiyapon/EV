<template>
  <div class="wrapper">
    <!-- <div class="wrapper" :class="{'nav-open': $sidebar.showSidebar}"> -->

    <side-bar :background-color="backgroundColor">
      <div class="col-md-12 text-left ">
        <label for="Location">Location</label><br>
        <!-- <input class="form-comtrol" type="type" id="locationstart" name="locationstart" > -->
        <input aria-describedby="addon-right addon-left" class="form-control bg-white" type="text" id="autocomplete" name="autocomplete" v-model="address" ><i class="icon-refresh-02" @click="locatorButtonPressed"> </i><br>
      </div>
      <div class="col-md-12 text-left">
        <label for="Endways">Endways</label><br>
        <input aria-describedby="addon-right addon-left" class="form-control bg-white" type="text" id="endways" name="endways" ><br>
      </div>
      <div class="col-md-12 text-left">
        <label for="Namecar">Namecar</label><br>
        <input aria-describedby="addon-right addon-left" class="form-control bg-white" type="text" id="namecar" name="namecar"><br>
      </div>
      <div class="col-md-12 text-left">
        <label for="Battery">Battery</label><br>
        <input aria-describedby="addon-right addon-left" class="form-control bg-white" type="text" id="battery" name="battery"><br>
      </div>
      
      
      <!-- <sidebar-link to="/dashboard">
        <i class="tim-icons icon-chart-pie-36"></i>
        <template v-if="!isRTL">
          <p>Map</p>
        </template>
      </sidebar-link>

      <sidebar-link to="/user">
        <i class="tim-icons icon-single-02"></i>
        <template v-if="!isRTL">
          <p>User Profile</p>
        </template>
      </sidebar-link> -->

    </side-bar>

    <sidebar-share :background-color.sync="backgroundColor"></sidebar-share>

    <div class="main-panel" :data="backgroundColor">
      <top-navbar></top-navbar>

      <dashboard-content @click.native="toggleSidebar"></dashboard-content>

      <content-footer></content-footer>
    </div>
  </div>
</template>

<style lang="scss">
.pac-icon{
  display: none;
}
.pac-item{
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
}
.pac-item:hover{
  background-color: #ececec;
}
</style>

<script>
import TopNavbar from "./TopNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
import DashboardContent from "./DashboardContent.vue";
import MobileMenu from "./MobileMenu.vue";
import SideBar from "@/components/SidebarPlugin/SideBar.vue";
import SidebarLink from "@/components/SidebarPlugin/SidebarLink.vue";
import BaseInput from "@/components/index";
import axios from 'axios';


export default {
  components: {
    TopNavbar,
    BaseInput,
    DashboardContent,
    ContentFooter,
    // eslint-disable-next-line vue/no-unused-components
    MobileMenu,
    SideBar,
    SidebarLink,
  },
  data() {
    return {
      backgroundColor: "green",
      address: ""
    };
  },
  computed: {
    isRTL() {
      return this.$rtl.isRTL;
    },
  },
  mounted(){
    new google.maps.places.Autocomplete(
      document.getElementById("autocomplete"),
      {
        bounds: new google.maps.LatLngBounds(
          new google.maps.LatLng(45.4215296, -75.6971931)
        )
      }
    )
  },
  methods: {
    locatorButtonPressed(){
      if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(position => {
          this.getAddressFrom(position.coords.latitude,position.coords.longitude)
        },
        error => {
          console.log(error.message);
        }
        );
      } else{
        console.log("Your browser does not support geolocation API ");
      }
    },
    getAddressFrom(lat,long){
      axios.get("https://maps.googleapis.com/maps/api/geocode/json?latlng="
      + lat +
      ","
      + long
      + "&key=AIzaSyCEwuKRd9Fqz_RCZoonrVZAbNuVzvrA8JU")
      .then(response => {
        if(response.data.error_message){
          console.log(response.data.error_message);
        } else {
          this.address = response.data.results[0].formatted_address,
          console.log(response.data.results[0].formatted_address);
        }
      })
    },
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    },
  },
};
</script>
