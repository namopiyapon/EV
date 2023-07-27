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
import EditProfileForm from "./Profile/EditProfileForm.vue";
import { collection, addDoc, getDocs  } from "firebase/firestore"; 
import { db } from "../Firebase";
import { onMounted } from "vue";

// onMounted(() => {
//   const querySnapshot = getDocs(collection(db, "Usercar"));
// querySnapshot.forEach((doc) => {
//   console.log(`${doc.id} => ${doc.data()}`);
//   const data = {
//           'Brand': doc.data().Brand,
//           'Energy': doc.data().Energy,
//           'Model': doc.data().Model,
//           'Type': doc.data().Type,
//           'namecar': doc.data().namecar,
//         }
//         this.Usercar.push(data)
// });

// })

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
    // db.collection('Usercar').get().then
    // (UsercarSnapshot => {
    //   UsercarSnapshot.forEach(doc =>{
    //     const data = {
    //       'Brand': doc.data().Brand,
    //       'Energy': doc.data().Energy,
    //       'Model': doc.data().Model,
    //       'Type': doc.data().Type,
    //       'namecar': doc.data().namecar,
    //     }
    //     this.Usercar.push(data)
    //   })
    // })
  }
};
</script>
<style></style>
