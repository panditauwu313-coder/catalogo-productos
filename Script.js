let precioActual = 0;

function abrirFormulario(producto, precio) {
  document.getElementById("formPopup").style.display = "flex";

  document.getElementById("producto").value = producto;
  document.getElementById("cantidad").value = 1;

  precioActual = precio;

  actualizarTotal();
}

function cerrarFormulario() {
  document.getElementById("formPopup").style.display = "none";
}

function actualizarTotal() {
  const cantidad = document.getElementById("cantidad").value;
  const total = cantidad * precioActual;

  document.getElementById("total").textContent = "Total: $" + total;
}

document.getElementById("cantidad").addEventListener("input", actualizarTotal);

document.getElementById("pedidoForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const producto = document.getElementById("producto").value;
  const cantidad = document.getElementById("cantidad").value;
  const notas = document.getElementById("notas").value;

  const total = cantidad * precioActual;

  const mensaje = `🛒 Pedido nuevo:

Nombre: ${nombre}
Producto: ${producto}
Precio: $${precioActual}
Cantidad: ${cantidad}
Total: $${total}
Notas: ${notas}`;

  const numero = "993 277 5108"; //  numero 

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

import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const contenedor = document.getElementById("productos");

async function cargarProductos() {
  const querySnapshot = await getDocs(collection(db, "productos"));

  contenedor.innerHTML = "";

  querySnapshot.forEach((doc) => {
    const producto = doc.data();

    contenedor.innerHTML += `
      <div style="border:1px solid #ccc; padding:10px; margin:10px;">
        <h3>${producto.nombre}</h3>
        <p>$${producto.precio}</p>
      </div>
    `;
  });
}

cargarProductos();
