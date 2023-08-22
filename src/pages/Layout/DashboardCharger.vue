<template>
  <div class="wrapper">
    <!-- <div class="wrapper" :class="{'nav-open': $sidebar.showSidebar}"> -->

    <side-bar :background-color="backgroundColor">
      <!-- <mobile-menu slot="content"></mobile-menu> -->
      
      <div v-for="Station in ChargingStation" :key="Station.namecar"  @click="setidStation(Station.ID)" >
        <sidebar-link to="/appEVCharger"  >
          <i class="tim-icons icon-single-02" ></i>
          <template >
            <div class="row"  >
              <p>{{ Station.name }} </p>
            </div>
          </template>
        </sidebar-link>
      </div>

      <sidebar-link to="/appEVCharger">
        <i class="tim-icons icon-simple-add"></i>
        <template v-if="!isRTL">
          <p>APP</p>
        </template>
      </sidebar-link>

    </side-bar>

    <sidebar-share :background-color.sync="backgroundColor"></sidebar-share>

    <div class="main-panel" :data="backgroundColor">
      <top-navbar></top-navbar>

      <dashboard-content @click.native="toggleSidebar"></dashboard-content>

      <content-footer></content-footer>
    </div>


  </div>
</template>

<style lang="scss"></style>

<script >
import TopNavbar from "./TopNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
import DashboardContent from "./DashboardContent.vue";
import MobileMenu from "./MobileMenu.vue";
import SideBar from "@/components/SidebarPlugin/SideBar.vue";
import SidebarLink from "@/components/SidebarPlugin/SidebarLink.vue";
import { collection, where, query, getDocs } from "firebase/firestore"
import firebase from '@/Firebase.js'



export default {

  components: {
    TopNavbar,
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
      ChargingStation: [],
      idStation: [],
    };
  },

  computed: {
    isRTL() {
      return this.$rtl.isRTL;
    },
  },
  created() {
    this.getUsers()
    
  },
  methods: {
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    },
    async getUsers() {

      const q = query(collection(firebase.db, 'ChargingStation'))
      const querySnap = await getDocs(q);

      querySnap.forEach((doc) => {
        this.ChargingStation.push({ID: doc.id, ...doc.data()})
        console.log(doc.data());
      })
    },
    setidStation(idStation) {

      this.$store.commit('SET_IDTEST', idStation)
      this.$router.push('/appEVCharger')
    }

  },

};

</script>
