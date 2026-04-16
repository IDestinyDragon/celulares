const contenidoCarritoDiv = document.getElementById('contenido-carrito');
const totalCarritoP = document.getElementById('total-carrito');
const contadorCarritoSpan = document.getElementById('contador-carrito');

let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
let usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo')) || null;
let carrito = usuarioActivo ? (usuarioActivo.carrito || []) : [];
let idiomaActual = localStorage.getItem('idioma') || 'es';

const formatoMoneda = (valor) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(valor);

function actualizarContadorCarrito() {
    if (contadorCarritoSpan) {
        const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
        contadorCarritoSpan.textContent = totalItems;
    }
}

function guardarEstado() {
    if (usuarioActivo) {
        const index = usuarios.findIndex(u => u.email === usuarioActivo.email);
        if (index !== -1) {
            usuarios[index].carrito = carrito;
            usuarios[index].pedidos = usuarioActivo.pedidos || [];
            localStorage.setItem('usuarios', JSON.stringify(usuarios));
            localStorage.setItem('usuarioActivo', JSON.stringify(usuarioActivo));
        }
    }
    actualizarContadorCarrito();
}

function renderizarCarrito() {
    const contenedor = document.getElementById('contenido-carrito');
    const totalContenedor = document.getElementById('total-carrito-contenedor');
    const t = traducciones[idiomaActual];

    if (!contenedor) return;

    if (carrito.length === 0) {
        contenedor.innerHTML = `<p>${t.carritoVacio}</p>`;
        if(totalContenedor) totalContenedor.innerHTML = "";
        return;
    }

    let totalGlobal = 0;
    let html = `<table><tr><th>${t.tablaProducto || 'Producto'}</th><th>${t.tablaCant || 'Cant.'}</th><th>${t.tablaSubtotal || 'Subtotal'}</th><th>${t.tablaAccion || 'Acción'}</th></tr>`;

    carrito.forEach((item, index) => {
        const subtotal = item.precio * item.cantidad;
        totalGlobal += subtotal;
        html += `<tr>
            <td>${item.nombre}</td>
            <td>${item.cantidad}</td>
            <td>${formatoMoneda(subtotal)}</td>
            <td><button class="btn-eliminar" onclick="eliminar(${index})">${t.btnEliminar || 'Eliminar'}</button></td>
        </tr>`;
    });

    contenedor.innerHTML = html + `</table>`;

    if(totalContenedor) {
        const esAdmin = usuarioActivo && usuarioActivo.rol === "admin";
        totalContenedor.innerHTML = `
            <p style="font-size:1.5rem; font-weight:bold;">${t.total}: ${formatoMoneda(totalGlobal)}</p>
            <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:10px;">
                ${esAdmin ? `<button onclick="generarBackupLog()" class="btn-agregar" style="background: #3498db; width:auto; padding:10px 20px;">${t.btnLog || 'JSON Log'}</button>` : ''}
                <button onclick="finalizarCompra()" class="btn-agregar" style="background: #27ae60; width:auto; padding:10px 20px;">${t.finalizar}</button>
            </div>`;
    }
}

function eliminar(index) {
    if (carrito[index].cantidad > 1) {
        carrito[index].cantidad--;
    } else {
        carrito.splice(index, 1);
    }
    guardarEstado();
    renderizarCarrito();
}

function finalizarCompra() {
    if (carrito.length === 0) return;

    const registroPedido = {
        idCompra: "REG-" + Date.now(),
        fecha: new Date().toLocaleString(),
        correo: usuarioActivo.email,
        productos: [...carrito],
        total: carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0)
    };

    if (!usuarioActivo.pedidos) usuarioActivo.pedidos = [];
    usuarioActivo.pedidos.push(registroPedido);

    carrito = [];
    usuarioActivo.carrito = [];

    guardarEstado();
    alert(traducciones[idiomaActual].confirmarCompra);
    window.location.href = 'pedidos.html';
}

function generarBackupLog() {
    const todosLosPedidos = usuarios.flatMap(u => u.pedidos || []);
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(todosLosPedidos, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute("href", dataStr);
    dl.setAttribute("download", "registro_ventas.json");
    dl.click();
}

document.addEventListener('DOMContentLoaded', () => {
    actualizarContadorCarrito();
    if (contenidoCarritoDiv) renderizarCarrito();
});