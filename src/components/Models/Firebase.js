import app  from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';



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
      this.logged = false;
      this.user = {};
      this.dbUsers = app.firestore().collection('users'); 
      this.auth.onAuthStateChanged( user => { if (user) {this.user=user; this.logged = true}else{this.user={}; this.logged=false}})
      this.googleProvider = new app.auth.GoogleAuthProvider();
    }

    
  
    // *** Auth API ***
  
    // doCreateUserWithEmailAndPassword = (email, password) =>
    //   this.auth.createUserWithEmailAndPassword(email, password);
  
    // doSignInWithEmailAndPassword = (email, password) =>
    //   this.auth.signInWithEmailAndPassword(email, password);
    
    pushTest = () => this.dbUsers.doc('test').set({'setTest':'Es un Test' }).then(ok=>ok).catch(err=>err)

    getUserName = () => this.user.displayName;

    getModelsReference = () => this.dbUsers.doc(this.user.uid).collection('models');

    deleteModel = modelId => this.dbUsers.doc(this.user.uid).collection('models').doc(modelId).delete().then(ok=>ok).catch(err=>err)
    
    doSignInWithGoogle = () => this.auth.signInWithPopup(this.googleProvider)
  
    doSignOut = () => this.auth.signOut()

  
  }
