// Importaciones necesarias
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

// Tu configuración (la que te dio Firebase)
const firebaseConfig = {
  apiKey: "AIzaSyD8Q5INY_EfTlyKp_vlnJZP9xWeqH_QhBg",
  authDomain: "catalogo-farid.firebaseapp.com",
  projectId: "catalogo-farid",
  storageBucket: "catalogo-farid.firebasestorage.app",
  messagingSenderId: "603623739227",
  appId: "1:603623739227:web:9367d301443e5978a1147e",
  measurementId: "G-E95G99KCD3"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
export const db = getFirestore(app);