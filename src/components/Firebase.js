import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyA_TRXZuLyyrUbJOc1clyLcJf7p7cPloFc",
  authDomain: "darpan-f9dd7.firebaseapp.com",
  databaseURL: "https://darpan-f9dd7.firebaseio.com",
  projectId: "darpan-f9dd7",
  storageBucket: "darpan-f9dd7.appspot.com",
  messagingSenderId: "866924434566",
  appId: "1:866924434566:web:1aa0e1eb1e2d13f133ed07",
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
