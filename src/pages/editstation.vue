<template>
  <div class="content">
    <div class="row">
      <div class="col-md-12">
        <!-- {{ this.$store.state.idStation }} -->
        <edit-Station-form :model="model"> </edit-Station-form>
      </div>
    </div>
  </div>
</template>
<script>
import EditStationForm from "./Profile/EditstationForm.vue";



export default {
  components: {
    EditStationForm,
    
  },
  data() {
    return {
      model: {

      }
      //Usercar: []
    };
  },

  created(){

  }
};
</script>
<style></style>
