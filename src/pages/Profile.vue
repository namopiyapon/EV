<template>
  <div class="content">
    <div class="row">
      <div class="col-md-12">
        
      </div>

    </div>
  </div>
</template>
<script>
export default {
  mounted() {
    if(this.$store.state.idtest != ''){
      this.$router.push('/user')
    }
    
  },
  
}

</script>
<style></style>
