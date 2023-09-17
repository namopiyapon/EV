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

        

        <a class="navbar-brand" href="/#/dashboard" style: position="absolute"> แผนที่ </a>
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
              ล๊อคอิน
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
                  แผนที่
                </a>
              </li>
              <li class="dropdown-divider"></li>

              <li class="nav-link">
                <a href="/#/password" class="nav-item dropdown-item">
                  แก้ไขรหัสผ่าน
                </a>
              </li>

              <li class="nav-link">
                <a href="/#/profile" class="nav-item dropdown-item">
                  รถยนต์ไฟฟ้า
                </a>
              </li>
              <li class="nav-link">
                <a href="/#/Feedback" class="nav-item dropdown-item">
                  ติดต่อผู้ดูแล
                </a>
              </li>
              <!-- for admin -->
              <li class="nav-link" v-if="admin">
                <a href="/#/addstation" class="nav-item dropdown-item">
                  เพิ่มปั๊มชาร์จไฟฟ้า
                </a>
              </li>
              <li class="nav-link" v-if="admin">
                <a href="/#/station" class="nav-item dropdown-item">
                  แก้ไขปั๊มชาร์จไฟฟ้า
                </a>
              </li>
              <li class="nav-link" v-if="admin">
                <a href="/#/uptype" class="nav-item dropdown-item">
                  ประเภทหัวชาร์จ
                </a>
              </li>

              <li class="dropdown-divider"></li>

              <li class="nav-link">
                <a href="/#/login" class="nav-item dropdown-item" @click="signOut">
                  ล๊อคเอ้า
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
import { getAuth, signOut, onAuthStateChanged, createUserWithEmailAndPassword } from 'firebase/auth';
import firebase from '@/Firebase.js'
import { query, collection, where, getDocs } from "firebase/firestore"

export default {
  components: {
    DropDown,
    Modal,
  },
  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      this.user = user;
      this.admin = await this.getadmin(user); // รอให้การร้องขอดึงข้อมูลผู้ดูแลระบบเสร็จสิ้นก่อนที่จะตั้งค่าค่า this.admin
    });
  },
  data() {
    return {
      searchModalVisible: false,
      searchQuery: "",
      showMenu: false,
      user: null,
      adminarr: [],
      admin: false,
    };
  },
  methods: {
    async getadmin(user) {
      if (user && user.email) {
        const q = query(collection(firebase.db, 'admin'), where('email', '==', user.email));
        const querySnap = await getDocs(q);
        if (!querySnap.empty) {
          return true; // ถ้ามีข้อมูลในคอลเล็กชัน 'admin' ให้คืนค่า true
        }
      }
      return false; // ถ้าไม่มีข้อมูลให้คืนค่า false
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
