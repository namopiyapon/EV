<template>
  <nav class="navbar navbar-expand-lg navbar-absolute" :class="{ 'bg-white': showMenu, 'navbar-transparent': !showMenu }">
    <div class="container-fluid">
      <div class="navbar-wrapper">
        <div class="navbar-toggle d-inline" :class="{ toggled: $sidebar.showSidebar }"
          v-if="$route.name != 'Map' && $route.name != 'Give Feedback' && $route.name != 'Register' && $route.name != 'Login' && $route.name != 'password'">
          <button type="button" class="navbar-toggler" @click="toggleSidebar">
            <span class="navbar-toggler-bar bar1"></span>

            <span class="navbar-toggler-bar bar2"></span>

            <span class="navbar-toggler-bar bar3"></span>
          </button>
        </div>

        <a class="navbar-brand" href="/#/dashboard" @click=""> MAP </a>
      </div>

      <button class="navbar-toggler" type="button" @click="toggleMenu" data-toggle="collapse" data-target="#navigation"
        aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-bar navbar-kebab"></span>

        <span class="navbar-toggler-bar navbar-kebab"></span>

        <span class="navbar-toggler-bar navbar-kebab"></span>
      </button>

      <div class="collapse navbar-collapse show text-left" v-show="showMenu">
        <ul class="navbar-nav" :class="$rtl.isRTL ? 'mr-auto' : 'ml-auto'">

          <modal :show.sync="searchModalVisible" class="modal-search" id="searchModal" :centered="false"
            :show-close="true">
            <input slot="header" v-model="searchQuery" type="text" class="form-control" id="inlineFormInputGroup"
              placeholder="SEARCH" />
          </modal>

          <div v-if="!user">
            <a href="/#/login" class="nav-item dropdown-item">
              Login
            </a>
          </div>

          <drop-down v-if="user">
            <a href="#" class="dropdown-toggle nav-link" data-toggle="dropdown">
              <div class="Profile">
                {{ user.email }}
              </div>

              <b class="caret d-none d-lg-block d-xl-block"></b>

              <!-- <p class="d-lg-none">Profile</p> -->
            </a>

            <ul class="dropdown-menu dropdown-navbar" v-if="user">
              <li class="nav-link">
                <a href="/#/dashboard" class="nav-item dropdown-item">
                  MAP
                </a>
              </li>
              <li class="dropdown-divider"></li>

              <li class="nav-link">
                <a href="/#/password" class="nav-item dropdown-item">
                  Edit password
                </a>
              </li>

              <li class="nav-link">
                <a href="/#/profile" class="nav-item dropdown-item">
                  My Car
                </a>
              </li>
              <li class="nav-link">
                <a href="/#/Feedback" class="nav-item dropdown-item">
                  Give Feedback
                </a>
              </li>
              <!-- for admin -->
              <li class="nav-link" v-if="admin">
                <a href="/#/addstation" class="nav-item dropdown-item">
                  ADD Station
                </a>
              </li>
              <li class="nav-link" v-if="admin">
                <a href="/#/station" class="nav-item dropdown-item">
                  Edit Station
                </a>
              </li>

              <li class="dropdown-divider"></li>

              <li class="nav-link">
                <a href="/#/login" class="nav-item dropdown-item" @click="signOut">
                  Log out
                </a>
              </li>
            </ul>

          </drop-down>

        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import DropDown from "@/components/Dropdown.vue";
import Modal from "@/components/Modal.vue";
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import firebase from '@/Firebase.js'
import { query, collection, where, getDocs } from "firebase/firestore"

export default {
  components: {
    DropDown,
    Modal,
  },
  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      this.user = user;
    });
    this.admin = this.getadmin()
  },
  data() {
    return {
      searchModalVisible: false,
      searchQuery: "",
      showMenu: false,
      user: null,
      adminarr: [],
      admin: null,
    };
  },
  methods: {
    async getadmin(user) {
      // ตรวจสอบว่ามีผู้ใช้ที่ลงชื่อเข้าใช้แล้ว (user) และไม่ใช่ผู้ดูแลระบบ
      if (user) {
        const q = query(collection(firebase.db, 'admin'), where('email', '==', user.email))
        const querySnap = await getDocs(q);

        querySnap.forEach((doc) => {
          this.adminarr.push(doc.data())
        })

        // ตรวจสอบว่าผู้ใช้ปัจจุบันเป็นผู้ดูแลระบบหรือไม่
        if (this.adminarr.length > 0 && this.adminarr[0].email === user.email) {
          console.log(this.adminarr[0].email + " == " + user.email)
          return true;
        }
      }

      return false; // หรือค่าอื่น ๆ ที่เหมาะสมในกรณีที่ไม่มีผู้ใช้หรือผู้ดูแลระบบ
    },

    toggleSidebar() {
      this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
    },
    toggleMenu() {
      this.showMenu = !this.showMenu;
    },
    signOut() {
      const auth = getAuth();
      signOut(auth)
        .then(() => {
          this.user = null;
        })
        .catch((error) => {
          console.error('Error signing out:', error);
        });
    },

  },
  computed: {
    isRTL() {
      return this.$rtl.isRTL;
    },
  },
};
</script>

<style></style>
