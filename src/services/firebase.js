import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyA4uUgPw9ya-bsXFP2fIZImVqXXHtj8BE4",
  authDomain: "dentaline-wonderland.firebaseapp.com",
  projectId: "dentaline-wonderland",
  storageBucket: "dentaline-wonderland.firebasestorage.app",
  messagingSenderId: "134268635132",
  appId: "1:134268635132:web:94e6772d2914447a95d479"
};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app)

export { db }