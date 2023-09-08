<template>
  <!-- <div class="wrapper"> -->
    <div class="main-panel" :data="backgroundColor">
      <top-navbar></top-navbar>

      <dashboard-content ></dashboard-content>
<!-- //@click.native="toggleSidebar" -->
      <content-footer></content-footer>
    </div>
  <!-- </div> -->
</template>

<style></style>

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
  mounted() {

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
