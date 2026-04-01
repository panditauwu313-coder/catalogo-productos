// Añadir funcionalidad al botón "Añadir al carrito"
document.querySelectorAll('.product-card button').forEach(button => {
    button.addEventListener('click', () => {
        alert('Producto añadido al carrito');
    });
});