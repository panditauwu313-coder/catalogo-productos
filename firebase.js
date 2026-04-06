import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD8Q5INY_EfTlyKp_vlnJZP9xWeqH_QhBg",
  authDomain: "catalogo-farid.firebaseapp.com",
  projectId: "catalogo-farid",
  storageBucket: "catalogo-farid.appspot.com",
  messagingSenderId: "603623739227",
  appId: "1:603623739227:web:9367d301443e5978a1147e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {
  db,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc, // 🔥 IMPORTANTE
  doc,
  onSnapshot
};