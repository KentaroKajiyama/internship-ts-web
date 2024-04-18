// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCd4fSPhcpuwYt5pA3Y53WqXrGdkxjG_L4",
    authDomain: "todo-auth-8385b.firebaseapp.com",
    projectId: "todo-auth-8385b",
    storageBucket: "todo-auth-8385b.appspot.com",
    messagingSenderId: "187487633853",
    appId: "1:187487633853:web:8698177e577ff23a0e92d4",
    measurementId: "G-VZ4BB991HP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
