<template>
  <div class="content">
    <div class="row">
      <div class="col-md-12">
        <edit-Addprofile-form :model="model"> </edit-Addprofile-form>
      </div>
      
    </div>
  </div>
</template>
<script>
import EditAddProfileForm from "./Profile/EditAddProfileForm.vue";

export default {
  components: {
    EditAddProfileForm,
    
  },
  data() {
    return {
      model: {}

    };
  },

};
</script>
<style></style>
