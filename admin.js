import { db } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

window.agregarProducto = async function () {
  console.log("CLICK DETECTADO");

  try {
    const nombre = document.getElementById("nombre").value;
    const precio = document.getElementById("precio").value;

    console.log(nombre, precio);

    const docRef = await addDoc(collection(db, "productos"), {
      nombre: nombre,
      precio: Number(precio)
    });

    console.log("Guardado con ID:", docRef.id);
    alert("Producto agregado");

  } catch (error) {
    console.error("ERROR:", error);
  }
};