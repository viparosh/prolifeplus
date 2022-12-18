import { initializeApp } from "firebase/app"
import { getStorage } from "firebase/storage"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDCplhEoYnwuCCW-ehwhHW5Op1I19nk0J0",
  authDomain: "mtathos-a572c.firebaseapp.com",
  projectId: "mtathos-a572c",
  storageBucket: "mtathos-a572c.appspot.com",
  messagingSenderId: "196879998739",
  appId: "1:196879998739:web:f57702be6aa443a9f8c4e6",
  measurementId: "G-T6G062NJ9V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)
