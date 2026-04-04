// 🔥 IMPORTS FIREBASE
import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

// 🔥 VARIABLES
let precioActual = 0;
const contenedor = document.getElementById("productos");

// 🔥 CARGAR PRODUCTOS DESDE FIREBASE
async function cargarProductos() {
  contenedor.innerHTML = "<p>Cargando...</p>";

  const querySnapshot = await getDocs(collection(db, "productos"));

  contenedor.innerHTML = "";

  querySnapshot.forEach((docu) => {
    const producto = docu.data();

    contenedor.innerHTML += `
      <div class="product-card">
        <img src="${producto.imagen}">
        <h2>${producto.nombre}</h2>
        <p class="price">$${producto.precio}</p>
        <p>Stock: ${producto.stock}</p>

        ${
          producto.stock > 0
            ? `<button onclick="abrirFormulario('${producto.nombre}', ${producto.precio})">Pedir</button>`
            : `<button disabled>Agotado</button>`
        }
      </div>
    `;
  });
}

cargarProductos();

// 🔥 FORMULARIO
window.abrirFormulario = function(producto, precio) {
  document.getElementById("formPopup").style.display = "flex";

  document.getElementById("producto").value = producto;
  document.getElementById("cantidad").value = 1;

  precioActual = precio;

  actualizarTotal();
};

window.cerrarFormulario = function() {
  document.getElementById("formPopup").style.display = "none";
};

function actualizarTotal() {
  const cantidad = document.getElementById("cantidad").value;
  const total = cantidad * precioActual;

  document.getElementById("total").textContent = "Total: $" + total;
}

document.getElementById("cantidad").addEventListener("input", actualizarTotal);

// 🔥 ENVÍO A WHATSAPP + STOCK AUTOMÁTICO
document.getElementById("pedidoForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const nombre = document.getElementById("nombreCliente").value;
  const producto = document.getElementById("producto").value;
  const cantidad = Number(document.getElementById("cantidad").value);
  const notas = document.getElementById("notas").value;

  const total = cantidad * precioActual;

  // 🔥 DESCONTAR STOCK
  const querySnapshot = await getDocs(collection(db, "productos"));

  for (const docu of querySnapshot.docs) {
    const p = docu.data();

    if (p.nombre === producto) {
      const nuevoStock = p.stock - cantidad;

      if (nuevoStock < 0) {
        alert("No hay suficiente stock");
        return;
      }

      await updateDoc(doc(db, "productos", docu.id), {
        stock: nuevoStock
      });

      break;
    }
  }

  // 🔥 MENSAJE WHATSAPP
  const mensaje = `🛒 Pedido nuevo:

Nombre: ${nombre}
Producto: ${producto}
Precio: $${precioActual}
Cantidad: ${cantidad}
Total: $${total}
Notas: ${notas}`;

  const numero = "9932775108";

  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

  window.open(url, "_blank");

  cerrarFormulario();
  this.reset();
});

// cerrar si da click fuera
window.onclick = function(e) {
  const popup = document.getElementById("formPopup");
  if (e.target === popup) {
    cerrarFormulario();
  }
};