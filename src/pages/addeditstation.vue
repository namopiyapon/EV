<template>
  <div class="content">
    <div class="row">
      <div class="col-md-12">
        <!-- {{ this.$store.state.idStation }} -->
        <edit-Addstation-form :model="model"> </edit-Addstation-form>
      </div>
    </div>
  </div>
</template>
<script>
import EditAddstationForm from "./Profile/EditaddstationForm.vue";



export default {
  components: {
    EditAddstationForm,
    
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
