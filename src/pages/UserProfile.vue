<template>
  <div class="content">
    <div class="row">
      <div class="col-md-12">
        <!-- {{ this.$store.state.idtest }} -->
        <edit-profile-form :model="model"> </edit-profile-form>
      </div>
      
    </div>
  </div>
</template>
<script>
import EditProfileForm from "./Profile/EditProfileForm.vue";



export default {
  components: {
    EditProfileForm,
    
  },
  data() {
    return {
      model: {}
      //Usercar: []
    };
  },

  created(){

  }
};
</script>
<style></style>
