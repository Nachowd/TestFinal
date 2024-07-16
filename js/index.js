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
            <button onclick="agregarAlCarrito(${repuesto.id})">Agregar al Carrito</button>
        `;
        productosDiv.appendChild(productoDiv);
    });
}

function agregarAlCarrito(id) {
    let repuesto = window.repuestos.find(r => r.id === id);
    carrito.push(repuesto);
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
            confirmButton: 'cssdelboton'
        }
    });
}

function eliminarDelCarrito(id) {
    let index = carrito.findIndex(r => r.id === id);
    if (index !== -1) {
        let [repuesto] = carrito.splice(index, 1);
        localStorage.setItem('carrito', JSON.stringify(carrito));

        Swal.fire({
            icon: 'success',
            title: '¡Producto eliminado!',
            text: `${repuesto.nombre} eliminado del carrito.`,
            confirmButtonText: 'Aceptar',
            customClass: {
                popup: 'cssdepopup',
                header: 'cssdelheader',
                title: 'cssdeltitulo',
                content: 'cssdelcontenido',
                confirmButton: 'cssdelboton'
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
                confirmButton: 'cssdelboton'
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
                confirmButton: 'cssdelboton'
            }
        });
        return;
    }

    let total = 0;
    let mensaje = 'Productos en tu carrito:\n';

    carrito.forEach((repuesto, index) => {
        let precioDescuento = repuesto.precio * (1 - repuesto.descuento / 100);
        total += precioDescuento;
        mensaje += `${index + 1}. ${repuesto.nombre} - Precio: $${precioDescuento.toFixed(2)}\n`;
    });

    mensaje += `\nTotal a pagar: $${total.toFixed(2)}\n`;
    mensaje += '\n¿Quieres eliminar algún producto del carrito? Ingresa el número del producto o cancela para mantener tu carrito.\n';

    Swal.fire({
        icon: 'info',
        title: 'Productos en tu carrito',
        text: mensaje,
        input: 'text',
        inputPlaceholder: 'Ingresa el número del producto',
        confirmButtonText: 'Aceptar',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        cancelButtonColor: '#d33',
        customClass: {
            popup: 'cssdepopup',
            header: 'cssdelheader',
            title: 'cssdeltitulo',
            content: 'cssdelcontenido',
            confirmButton: 'cssdelboton'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            let numero = parseInt(result.value);
            if (!isNaN(numero) && numero > 0 && numero <= carrito.length) {
                eliminarDelCarrito(carrito[numero - 1].id);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Opción inválida.',
                    confirmButtonText: 'Aceptar',
                    customClass: {
                        popup: 'cssdepopup',
                        header: 'cssdelheader',
                        title: 'cssdeltitulo',
                        content: 'cssdelcontenido',
                        confirmButton: 'cssdelboton'
                    }
                });
            }
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