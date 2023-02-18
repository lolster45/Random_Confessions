// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyCjs0z64ysfBUYgs9Lpub8fdi8HNF6WNxU",
  authDomain: "confessions-website.firebaseapp.com",
  projectId: "confessions-website",
  storageBucket: "confessions-website.appspot.com",
  messagingSenderId: "597392200228",
  appId: "1:597392200228:web:675815f5adaf6f595b3eb1",
  measurementId: "G-XQLCKPNL9Y"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getFirestore(app)