<template>
  <nav class="navbar navbar-expand-lg navbar-absolute" :class="{ 'bg-white': showMenu, 'navbar-transparent': !showMenu }">
    <div class="container-fluid">
      <div class="navbar-wrapper">
        <div class="navbar-toggle d-inline" :class="{ toggled: $sidebar.showSidebar }" v-if="$route.name != 'Map'">
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

          <drop-down>
            <a href="#" class="dropdown-toggle nav-link" data-toggle="dropdown">
              <div class="email">
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

              <li class="dropdown-divider"></li>

              <li class="nav-link">
                <a href="/#/login" class="nav-item dropdown-item" @click="signOut">
                  Log out
                </a>
              </li>
            </ul>

            <ul class="dropdown-menu dropdown-navbar" v-else>

              <li class="nav-link">
                <a href="/#/login" class="nav-item dropdown-item">
                  Login
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
import { getAuth, signOut ,onAuthStateChanged} from 'firebase/auth';

export default {
  components: {
    DropDown,
    Modal,
  },
  mounted() {
    // console.log(Vue.$cookies.get('email'))
    const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            this.user = user;
        });
  },
  data() {
    return {
      searchModalVisible: false,
      searchQuery: "",
      showMenu: false,
      user: null,
    };
  },
  methods: {
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
