import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

let precioActual = 0;
const contenedor = document.getElementById("productos");

// 🔥 CARGAR PRODUCTOS
async function cargarProductos() {
  const querySnapshot = await getDocs(collection(db, "productos"));

  contenedor.innerHTML = "";

  querySnapshot.forEach((docu) => {
    const p = docu.data();

    contenedor.innerHTML += `
      <div>
        <img src="${p.imagen}" width="100">
        <h3>${p.nombre}</h3>
        <p>$${p.precio}</p>
        <p>Stock: ${p.stock}</p>

        ${
          p.stock > 0
            ? `<button onclick="abrirFormulario('${p.nombre}', ${p.precio})">Pedir</button>`
            : `<button disabled>Agotado</button>`
        }
      </div>
    `;
  });
}

cargarProductos();

// 🔥 FORMULARIO
window.abrirFormulario = function(producto, precio) {
  document.getElementById("formPopup").style.display = "block";
  document.getElementById("producto").value = producto;
  precioActual = precio;
  actualizarTotal();
};

window.cerrarFormulario = function() {
  document.getElementById("formPopup").style.display = "none";
};

function actualizarTotal() {
  const cantidad = document.getElementById("cantidad").value;
  document.getElementById("total").innerText =
    "Total: $" + cantidad * precioActual;
}

document.getElementById("cantidad").addEventListener("input", actualizarTotal);

// 🔥 PEDIDO + STOCK
document.getElementById("pedidoForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const nombre = document.getElementById("nombreCliente").value;
  const producto = document.getElementById("producto").value;
  const cantidad = Number(document.getElementById("cantidad").value);
  const notas = document.getElementById("notas").value;

  const querySnapshot = await getDocs(collection(db, "productos"));

  for (const docu of querySnapshot.docs) {
    const p = docu.data();

    if (p.nombre === producto) {
      if (p.stock < cantidad) {
        alert("No hay stock suficiente");
        return;
      }

      await updateDoc(doc(db, "productos", docu.id), {
        stock: p.stock - cantidad
      });

      break;
    }
  }

  const mensaje = `Pedido:
Nombre: ${nombre}
Producto: ${producto}
Cantidad: ${cantidad}
Notas: ${notas}`;

  const numero = "9932775108";
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

  window.open(url);

  cerrarFormulario();
  this.reset();
});