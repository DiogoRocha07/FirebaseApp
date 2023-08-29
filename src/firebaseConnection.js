import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyCbUlKIys8S3QE4x5bF2m47iY38eJ-BfpA",
    authDomain: "cursoproject1-1f1a1.firebaseapp.com",
    projectId: "cursoproject1-1f1a1",
    storageBucket: "cursoproject1-1f1a1.appspot.com",
    messagingSenderId: "672361145675",
    appId: "1:672361145675:web:d169601af639947f8b74ce",
    measurementId: "G-YLRW0GXRRP"
  };

  const firebaseApp = initializeApp(firebaseConfig)

  const db = getFirestore(firebaseApp)
  const auth = getAuth(firebaseApp)

  export { db, auth };