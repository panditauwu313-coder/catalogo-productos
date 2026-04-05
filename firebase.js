// SIN imports, TODO global
const firebaseConfig = {
  apiKey: "AIzaSyD8Q5INY_EfTlyKp_vlnJZP9xWeqH_QhBg",
  authDomain: "catalogo-farid.firebaseapp.com",
  projectId: "catalogo-farid",
  storageBucket: "catalogo-farid.appspot.com",
  messagingSenderId: "603623739227",
  appId: "1:603623739227:web:9367d301443e5978a1147e"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

export { db };