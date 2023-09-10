// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCN6XFnp3GE9qCQ2IVPLjFHgtev6NRS2c8",
  authDomain: "evcharge191.firebaseapp.com",
  projectId: "evcharge191",
  storageBucket: "evcharge191.appspot.com",
  messagingSenderId: "509223965161",
  appId: "1:509223965161:web:62c87b31e619428c1f3b78",
  measurementId: "G-ZZ8GSKMRH7"
  // measurementId: "G-7MQ4HLGC7F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
export default {app, analytics, db}

// Get a list of cities from your database
// async function getUsercar(db) {
//   const Usercar = collection(db, 'Usercar');
//   const UsercarSnapshot = await getDocs(Usercar);
//   const UsercarList = UsercarSnapshot.docs.map(doc => doc.data());
//   return UsercarList;
// }