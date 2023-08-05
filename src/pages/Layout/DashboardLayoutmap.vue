<template>
  <div class="wrapper">
    <!-- <div class="wrapper" :class="{'nav-open': $sidebar.showSidebar}"> -->

    <!-- <side-bar :background-color="backgroundColor">
      <div class="col-md-12 text-left ">
        <label for="Location">Location</label><br>
        <input class="form-comtrol" type="type" id="locationstart" name="locationstart" >
        <input type="text" id="autocomplete" name="autocomplete" v-model="address" ><i class="icon-refresh-02" @click="locatorButtonPressed"> </i><br>
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
      

    </side-bar> -->

    <sidebar-share :background-color.sync="backgroundColor"></sidebar-share>

    <div class="main-panel" :data="backgroundColor">
      <top-navbar></top-navbar>

      <dashboard-content @click.native="toggleSidebar"></dashboard-content>

      <content-footer></content-footer>
    </div>
  </div>
</template>

<style lang="scss">

</style>

<script>
import TopNavbar from "./TopNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
import DashboardContent from "./DashboardContent.vue";
import MobileMenu from "./MobileMenu.vue";
import SideBar from "@/components/SidebarPlugin/SideBar.vue";
import SidebarLink from "@/components/SidebarPlugin/SidebarLink.vue";
import BaseInput from "@/components/index";



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
    
  },
  methods: {
    
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    },
  },
};
</script>
