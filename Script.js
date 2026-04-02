//Formulario

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

//  detectar cuando cambia la cantidad
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
Precio unitario: $${precioActual}
Cantidad: ${cantidad}
Total: $${total}
Notas: ${notas}`;

  const numero = "5252 993 277 5108"; //remplazar con el numero de mi amigo xd

  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

  window.open(url, "_blank");

  cerrarFormulario();
  this.reset();
});