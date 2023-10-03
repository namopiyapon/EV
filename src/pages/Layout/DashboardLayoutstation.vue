<template>
  <div class="wrapper">
    <!-- <div class="wrapper" :class="{'nav-open': $sidebar.showSidebar}"> -->

    <side-bar :background-color="backgroundColor">
      <!-- <mobile-menu slot="content"></mobile-menu> -->

      <div v-for="sta in station" :key="sta.ID" @click="setIdAndNavigate(sta.ID)">
        <sidebar-link :to="'/editstation/' + sta.ID">
          <i class="tim-icons icon-single-02"></i>
          <template>
            <div class="row">
              <p>{{ sta.address }} </p>
            </div>
          </template>
        </sidebar-link>
      </div>

      <!-- <sidebar-link to="/adduser">
        <i class="tim-icons icon-simple-add"></i>
        <template v-if="!isRTL">
          <p>ADD</p>
        </template>
      </sidebar-link> -->

    </side-bar>

    <!-- <sidebar-share :background-color.sync="backgroundColor"></sidebar-share> -->

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
import { getAuth, onAuthStateChanged } from "firebase/auth";
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
      station: [],
      id: [],
      user: null,
    };
  },
  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      this.user = user;
    });
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
      const auth = getAuth();
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          // สร้างคิวรี Firestore เมื่อผู้ใช้ล็อกอินอยู่
          const q = query(collection(firebase.db, 'station') , where('Type', '==', true))
          const querySnap = await getDocs(q);

          querySnap.forEach((doc) => {
            this.station.push({ ID: doc.id, ...doc.data() })
          })
        }
      });
    },
    setIdAndNavigate(id) {
      this.$store.commit('SET_Station', id);
      this.$router.push('/editstation/' + id);
    },
  },

};

</script>
