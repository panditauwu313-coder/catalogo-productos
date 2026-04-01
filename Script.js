// Añadir funcionalidad al botón "Añadir al carrito"
document.querySelectorAll('.product-card button').forEach(button => {
    button.addEventListener('click', () => {
        alert('Producto añadido al carrito');
    });
});

document.getElementById("pedidoForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const producto = document.getElementById("producto").value;
  const cantidad = document.getElementById("cantidad").value;
  const notas = document.getElementById("notas").value;

  const pedido = {
    nombre,
    producto,
    cantidad,
    notas
  };

  console.log("Pedido:", pedido);

  alert("Pedido enviado (solo prueba)");

  this.reset();
});