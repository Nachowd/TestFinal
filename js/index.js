let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

fetch('js/repuestos.json')
    .then(response => response.json())
    .then(repuestos => {
        mostrarProductos(repuestos);
        window.repuestos = repuestos;
    })
    .catch(error => console.error('Error al cargar los repuestos:', error));

function mostrarProductos(productos) {
    let productosDiv = document.getElementById('productos');
    productosDiv.innerHTML = '';

    productos.forEach(repuesto => {
        let productoDiv = document.createElement('div');
        productoDiv.classList.add('producto');
        productoDiv.innerHTML = `
            <img src="${repuesto.imagen}" alt="${repuesto.nombre}" />
            <h2>${repuesto.nombre}</h2>
            <p>Precio: $${repuesto.precio}</p>
            <p>Descuento: ${repuesto.descuento}%</p>
            <button class="carrito-button" onclick="agregarAlCarrito(${repuesto.id})">Agregar al Carrito</button>
        `;
        productosDiv.appendChild(productoDiv);
    });
}

function agregarAlCarrito(id) {
    let repuesto = window.repuestos.find(r => r.id === id);
    let itemCarrito = carrito.find(item => item.id === repuesto.id);

    if (itemCarrito) {
        itemCarrito.cantidad++;
    } else {
        repuesto.cantidad = 1;
        carrito.push(repuesto);
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));

    Swal.fire({
        icon: 'success',
        title: '¡Producto agregado!',
        text: `${repuesto.nombre} agregado al carrito.`,
        confirmButtonText: 'Aceptar',
        customClass: {
            popup: 'cssdepopup',
            header: 'cssdelheader',
            title: 'cssdeltitulo',
            content: 'cssdelcontenido',
            confirmButton: 'carrito-button'
        }
    });
}

function eliminarDelCarrito(id) {
    let itemCarrito = carrito.find(item => item.id === id);

    if (itemCarrito) {
        if (itemCarrito.cantidad > 1) {
            itemCarrito.cantidad--;
        } else {
            carrito = carrito.filter(item => item.id !== id);
        }
        localStorage.setItem('carrito', JSON.stringify(carrito));

        Swal.fire({
            icon: 'success',
            title: '¡Producto eliminado!',
            text: `${itemCarrito.nombre} eliminado del carrito.`,
            confirmButtonText: 'Aceptar',
            customClass: {
                popup: 'cssdepopup',
                header: 'cssdelheader',
                title: 'cssdeltitulo',
                content: 'cssdelcontenido',
                confirmButton: 'carrito-button'
            }
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No tienes ese producto en el carrito.',
            confirmButtonText: 'Aceptar',
            customClass: {
                popup: 'cssdepopup',
                header: 'cssdelheader',
                title: 'cssdeltitulo',
                content: 'cssdelcontenido',
                confirmButton: 'carrito-button'
            }
        });
    }
}

function mostrarCarrito() {
    if (carrito.length === 0) {
        Swal.fire({
            icon: 'info',
            title: 'Carrito vacío',
            text: 'Aún no tienes productos en el carrito.',
            confirmButtonText: 'Aceptar',
            customClass: {
                popup: 'cssdepopup',
                header: 'cssdelheader',
                title: 'cssdeltitulo',
                content: 'cssdelcontenido',
                confirmButton: 'carrito-button'
            }
        });
        return;
    }

    let total = 0;
    let contenidoHTML = `
        <ul class="list-group">
    `;

    carrito.forEach((repuesto, index) => {
        let precioDescuento = repuesto.precio * (1 - repuesto.descuento / 100);
        total += precioDescuento * repuesto.cantidad;
        contenidoHTML += `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                    <h5>${repuesto.nombre}</h5>
                    <p>Precio: $${precioDescuento.toFixed(2)} x ${repuesto.cantidad}</p>
                </div>
                <button class="btn eliminar-button btn-sm" onclick="eliminarDelCarrito(${repuesto.id})">Eliminar</button>
            </li>
        `;
    });

    contenidoHTML += `
        </ul>
        <div class="mt-3">
            <h5>Total a pagar: $${total.toFixed(2)}</h5>
        </div>
    `;

    Swal.fire({
        icon: 'info',
        title: 'Productos en tu carrito',
        html: contenidoHTML,
        confirmButtonText: 'Aceptar',
        customClass: {
            popup: 'cssdepopup',
            header: 'cssdelheader',
            title: 'cssdeltitulo',
            content: 'cssdelcontenido',
            confirmButton: 'carrito-button'
        }
    });
}

function filtrarProductos() {
    let busqueda = document.getElementById('buscar').value.toLowerCase();
    let productosFiltrados = window.repuestos.filter(repuesto =>
        repuesto.nombre.toLowerCase().includes(busqueda)
    );
    mostrarProductos(productosFiltrados);
}

