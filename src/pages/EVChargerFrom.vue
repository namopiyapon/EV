<template>
  <div class="content">
    <div class="row">
      <div class="col-md-12">
        <!-- {{ this.$store.state.idStation }} -->
        <Editevchargerfrom :model="model"> </Editevchargerfrom>
      </div>
    </div>
  </div>
</template>
<script>
import Editevchargerfrom from "./Profile/EditEVChargerFrom.vue";

export default {
  components: {
    Editevchargerfrom,
    
  },
  data() {
    return {
      model: {}
      //Usercar: []
    };
  },
};
</script>
<style></style>
