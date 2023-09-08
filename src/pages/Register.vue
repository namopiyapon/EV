<template>
    <div class="row">
      <div class="col-md-12">
        <edit-Register-form :model="model"> </edit-Register-form>
      </div>
      
    </div>
</template>
<script>
import EditRegisterForm from "./Profile/EditRegisterForm.vue";

export default {
  components: {
    EditRegisterForm,
    
  },
  mounted() {
    console.log('Start',  this.$store.state.namecar)
  },
  data() {
    return {
      model: {
        email: "",
        password: ""
      },
    };
  },
};
</script>
<style></style>
