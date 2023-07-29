<template>
  <div class="wrapper">
    <!-- <div class="wrapper" :class="{'nav-open': $sidebar.showSidebar}"> -->

    <side-bar :background-color="backgroundColor">
      <!-- <mobile-menu slot="content"></mobile-menu> -->
      
      <div v-for="user in Usercar" :key="user.namecar" @click="setId(user.ID)">
        <sidebar-link to="/user">
          <i class="tim-icons icon-single-02"></i>
          <template>
            <div class="row">
              <p>{{ user.namecar }} </p>
              <i class="tim-icons icon-simple-remove col-6 m-0 p-0 "></i>
            </div>
          </template>
        </sidebar-link>
      </div>

      <sidebar-link to="/appuser">
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
import { collection, onSnapshot } from "firebase/firestore"
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
      Usercar: [],
      id: [],
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
    add: function () {
      this.$store.dispatch('setid', user.namecar )
      console.log(this.$store.state.idname,'*******************')
    },

    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    },
    async getUsers() {
      // use 'collection()' instead of 'doc()'
      onSnapshot(collection(firebase.db, 'Usercar'), (snap) => {

        snap.forEach((doc) => {
          this.Usercar.push({ID: doc.id, ...doc.data()})
          console.log(doc.id, " => ", doc.data());

        })
      })

    },
    setId(id) {
      console.log("id is", id);
      this.$store.commit('SET_IDTEST', id)
    }

  },

};

</script>
