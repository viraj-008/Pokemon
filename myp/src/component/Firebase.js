import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {getAuth} from 'firebase/auth'

import 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBQuDs36XFZqujo31O1JwhCENqUqXdkLG0",
  authDomain: "final-pkm.firebaseapp.com",
  projectId: "final-pkm",
  storageBucket: "final-pkm.appspot.com",
  messagingSenderId: "429766763325",
  appId: "1:429766763325:web:6d41c2cd4b013d8ade9b54"
};

 const app = initializeApp(firebaseConfig);
 export const db=getFirestore(app)

 export   const auth =getAuth(app);

 export default app