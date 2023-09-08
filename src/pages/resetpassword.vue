<template>
  <div class="">
    <div class="row">
      <div class="col-md-12">
        <edit-Login-form :model="model"> </edit-Login-form>
      </div>

    </div>
  </div>
</template>
<script>
import EditLoginForm from "./Profile/EditpasswordForm.vue";


export default {
  components: {
    EditLoginForm,

  },
  data() {
    return {
      model: {

      },
    };
  },
};
</script>
<style>
</style>
  