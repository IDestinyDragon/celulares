// --- Elementos del DOM ---
// Estos elementos deben existir en el HTML correspondiente.
const contenidoCarritoDiv = document.getElementById('contenido-carrito'); // En carrito.html
const totalCarritoP = document.getElementById('total-carrito');       // En carrito.html
const contadorCarritoSpan = document.getElementById('contador-carrito'); // En header (común)

// --- Variables globales para el carrito ---
let carrito = [];
let total = 0;

// --- Funciones de utilidad ---

// Función para actualizar el contador del carrito en la cabecera
function actualizarContadorCarrito() {
    if (contadorCarritoSpan) {
        contadorCarritoSpan.textContent = carrito.length;
    }
}

// Función para cargar carrito y total desde localStorage
function cargarCarritoDesdeLocalStorage() {
    if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'));
        // Asegurarse de que total sea un número y tenga 2 decimales
        total = parseFloat(localStorage.getItem('total')) || 0;
    } else {
        // Si no hay nada en localStorage, inicializar carrito y total
        carrito = [];
        total = 0;
    }
    actualizarContadorCarrito();
}

// --- Funciones para la página del carrito (carrito.html) ---

// Función para renderizar los elementos del carrito en la página del carrito
function renderizarCarrito() {
    const contenedor = document.getElementById('contenido-carrito');
    const totalContenedor = document.getElementById('total-carrito-contenedor');

    // Validación de seguridad para que no de error en otras páginas
    if (!contenedor) return;

    if (carrito.length === 0) {
        contenedor.innerHTML = "<p>Carrito vacío</p>";
        if(totalContenedor) totalContenedor.innerHTML = "";
        return;
    }

    let html = `<table>
        <tr>
            <th>Producto</th>
            <th>Cant.</th>
            <th>Subtotal</th>
            <th>Acción</th>
        </tr>`;

    let totalGlobal = 0;

    carrito.forEach((item, index) => {
        const subtotal = item.precio * item.cantidad;
        totalGlobal += subtotal;
        html += `<tr>
            <td>${item.nombre}</td>
            <td>${item.cantidad}</td>
            <td>${formatoMoneda(subtotal)}</td>
            <td><button class="btn-eliminar" onclick="eliminar(${index})">Eliminar</button></td>
        </tr>`;
    });

    contenedor.innerHTML = html + `</table>`;

    if(totalContenedor) {
        // LÓGICA DE ADMIN: Solo el primer usuario registrado ve el log
        const esAdmin = usuarios.length > 0 && usuarioActivo && usuarios[0].email === usuarioActivo.email;

        totalContenedor.innerHTML = `
            <p style="font-size:1.5rem; font-weight:bold;">Total: ${formatoMoneda(totalGlobal)}</p>
            <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:10px;">
                ${esAdmin ? `<button onclick="generarBackupLog()" class="btn-agregar" style="background: #3498db; width:auto; padding:10px 20px;">Descargar Log del Día</button>` : ''}
                <button onclick="finalizarCompra()" class="btn-agregar" style="background: #27ae60; width:auto; padding:10px 20px;">Finalizar Compra</button>
            </div>
        `;
    }
}

// Manejador para el clic en el botón de eliminar
function handleEliminarClick(event) {
    if (event.target.classList.contains('btn-eliminar')) {
        const indexAEliminar = parseInt(event.target.dataset.index);

        if (indexAEliminar >= 0 && indexAEliminar < carrito.length) {
            const itemEliminado = carrito[indexAEliminar];
            total -= itemEliminado.precio; // Restar el precio del total
            carrito.splice(indexAEliminar, 1); // Eliminar el elemento del array

            // Actualizar localStorage
            localStorage.setItem('carrito', JSON.stringify(carrito));
            localStorage.setItem('total', total.toFixed(2));

            actualizarContadorCarrito(); // Actualizar el contador global
            renderizarCarrito(); // Volver a renderizar la tabla del carrito
        }
    }
}

// --- Inicialización al cargar la página ---
document.addEventListener('DOMContentLoaded', () => {
    cargarCarritoDesdeLocalStorage(); // Cargar carrito y total

    // Determinar qué página se está cargando y ejecutar la función correspondiente
    if (contenidoCarritoDiv) {
        // Estamos en la página del carrito (carrito.html)
        renderizarCarrito();
    }
});