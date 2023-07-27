import firebase from 'firebase'
import 'firebase/firestore'
import firebaseConfig from './firebaseConfig'


const firebaseApp = firebase.initializeApp(firebaseConfig)
export default firebaseApp.firestore()
// import { initializeApp } from 'firebase/app'
// import { firebaseConfig } from './config'

// initializeApp(firebaseConfig)

