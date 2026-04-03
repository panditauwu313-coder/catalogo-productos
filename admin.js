import { db } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

window.agregarProducto = async function () {
  const nombre = document.getElementById("nombre").value;
  const precio = document.getElementById("precio").value;

  if (!nombre || !precio) {
    alert("Completa los campos");
    return;
  }

  await addDoc(collection(db, "productos"), {
    nombre: nombre,
    precio: Number(precio)
  });

  alert("Producto agregado");

  document.getElementById("nombre").value = "";
  document.getElementById("precio").value = "";
};

console.log("click detectado");