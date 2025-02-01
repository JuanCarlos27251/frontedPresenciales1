// URL base de la API
const apiUrl = 'https://localhost:7186/api/RegistroPedido';

// Obtener la lista de pedidos
function getPedidos() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const pedidosLista = document.getElementById('pedidos-lista');
            pedidosLista.innerHTML = '';
            data.forEach(pedido => {
                const pedidoItem = document.createElement('div');
                pedidoItem.classList.add('pedido-item');
                pedidoItem.innerHTML = `
                    <h4>Pedido #${pedido.id}</h4>
                    <p>Nombre: ${pedido.nombre}</p>
                    <p>Precio: $${pedido.precio}</p>
                    <p>Registrado el: ${new Date(pedido.registro).toLocaleString()}</p>
                    <button onclick="editarPedido(${pedido.id})">Editar</button>
                    <button onclick="eliminarPedido(${pedido.id})">Eliminar</button>
                `;
                pedidosLista.appendChild(pedidoItem);
            });
        })
        .catch(error => console.error('Error al cargar los pedidos:', error));
}

// Crear un nuevo pedido
document.getElementById('add-pedido-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const nombre = document.getElementById('pedido-nombre').value;
    const precio = parseFloat(document.getElementById('pedido-precio').value);

    const nuevoPedido = {
        nombre: nombre,
        precio: precio,
        pagado: false,
        registro: new Date().toISOString(),
    };

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoPedido),
    })
    .then(response => response.json())
    .then(() => {
        getPedidos();  // Recargar la lista de pedidos
    })
    .catch(error => console.error('Error al agregar el pedido:', error));
});

// Editar un pedido
function editarPedido(id) {
    fetch(`${apiUrl}/${id}`)
        .then(response => response.json())
        .then(pedido => {
            document.getElementById('edit-pedido-nombre').value = pedido.nombre;
            document.getElementById('edit-pedido-precio').value = pedido.precio;
            const editForm = document.getElementById('edit-pedido-form');
            editForm.style.display = 'block';

            editForm.onsubmit = function (event) {
                event.preventDefault();

                const updatedPedido = {
                    nombre: document.getElementById('edit-pedido-nombre').value,
                    precio: parseFloat(document.getElementById('edit-pedido-precio').value),
                    pagado: pedido.pagado,
                    registro: pedido.registro,
                };

                fetch(`${apiUrl}/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedPedido),
                })
                .then(() => {
                    getPedidos();  // Recargar la lista de pedidos
                    editForm.style.display = 'none';
                })
                .catch(error => console.error('Error al actualizar el pedido:', error));
            };
        })
        .catch(error => console.error('Error al obtener el pedido:', error));
}

// Eliminar un pedido
function eliminarPedido(id) {
    fetch(`${apiUrl}/${id}`, {
        method: 'DELETE',
    })
    .then(() => {
        getPedidos();  // Recargar la lista de pedidos
    })
    .catch(error => console.error('Error al eliminar el pedido:', error));
}

// Inicializar la lista de pedidos al cargar la página
document.addEventListener('DOMContentLoaded', function () {
    getPedidos();
});
