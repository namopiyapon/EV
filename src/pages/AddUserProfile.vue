<template>
  <div class="content">
    <div class="row">
      <div class="col-md-12">
        <edit-profile-form :model="model"> </edit-profile-form>
      </div>
      
    </div>
  </div>
</template>
<script>
import EditProfileForm from "./Profile/EditAddProfileForm.vue";

export default {
  components: {
    EditProfileForm,
    
  },
  data() {
    return {
      model: {}

    };
  },

};
</script>
<style></style>
