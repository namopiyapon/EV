<template>
  <div class="content">
    <div class="row">
      <div class="col-md-12">
        <edit-GiveEVCharger-form :model="model"> </edit-GiveEVCharger-form>
      </div>
      
    </div>
  </div>
</template>
<script>
import EditGiveEVChargerForm from "./Profile/EditAppEVChargerForm.vue";

export default {
  components: {
    EditGiveEVChargerForm,
    
  },
  data() {
    return {
      
    };
  },
};
</script>
<style></style>
