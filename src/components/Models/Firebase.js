import app  from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';



const firebaseConfig = {
    apiKey: "AIzaSyABNWz15l41jDB9CgrceCS-E7tJvI4qETQ",
    authDomain: "optimizer-pl-io.firebaseapp.com",
    databaseURL: "https://optimizer-pl-io.firebaseio.com",
    projectId: "optimizer-pl-io",
    storageBucket: "optimizer-pl-io.appspot.com",
    messagingSenderId: "9328532745",
    appId: "1:9328532745:web:a0869d1580b25836"
  };

  // Initialize Firebase
  export default class FirebaseOptimizer {
    constructor() {
      if (!app.apps.length ) {app.initializeApp(firebaseConfig)}
      console.log('Initializando')
      this.auth = app.auth();
      this.db = app.database(); 
      this.googleProvider = new app.auth.GoogleAuthProvider();
    }
  
    // *** Auth API ***
  
    // doCreateUserWithEmailAndPassword = (email, password) =>
    //   this.auth.createUserWithEmailAndPassword(email, password);
  
    // doSignInWithEmailAndPassword = (email, password) =>
    //   this.auth.signInWithEmailAndPassword(email, password);
    
    sayHello = () => console.log('helloo babe')
    
    doSignInWithGoogle = () =>
      this.auth.signInWithPopup(this.googleProvider);
  
    doSignOut = () => this.auth.signOut();
  
  }
