document.addEventListener('DOMContentLoaded', () => {
    const clienteLista = document.getElementById('cliente-lista');
    const addClientForm = document.getElementById('add-client-form');
    const editClientForm = document.getElementById('edit-client-form');
    const editForm = document.getElementById('edit-client');
    const cancelEditBtn = document.getElementById('cancel-edit');

    let editingClientId = null;

    // Cargar clientes
    function loadClientes() {
        fetch('https://localhost:7186/api/clientes')
            .then(response => response.json())
            .then(clientes => {
                clienteLista.innerHTML = '';

                clientes.forEach(cliente => {
                    const clienteDiv = document.createElement('div');
                    clienteDiv.classList.add('menu-item');

                    clienteDiv.innerHTML = `
                        <h3>${cliente.nombre}</h3>
                        <p><strong>Teléfono:</strong> ${cliente.telefono}</p>
                        <button class="editar-btn" data-id="${cliente.id}">Editar</button>
                        <button class="eliminar-btn" data-id="${cliente.id}">Eliminar</button>
                    `;

                    // Agregar eventos
                    clienteDiv.querySelector('.eliminar-btn').addEventListener('click', () => {
                        eliminarCliente(cliente.id);
                    });

                    clienteDiv.querySelector('.editar-btn').addEventListener('click', () => {
                        mostrarFormularioEdicion(cliente);
                    });

                    clienteLista.appendChild(clienteDiv);
                });
            })
            .catch(error => console.error('Error al cargar los clientes:', error));
    }

    // Eliminar cliente
    function eliminarCliente(id) {
        fetch(`https://localhost:7186/api/clientes/${id}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                loadClientes();
            } else {
                console.error('Error al eliminar el cliente');
            }
        })
        .catch(error => console.error('Error al eliminar el cliente:', error));
    }

    // Mostrar formulario de edición
    function mostrarFormularioEdicion(cliente) {
        editingClientId = cliente.id;
        document.getElementById('edit-nombre').value = cliente.nombre;
        document.getElementById('edit-telefono').value = cliente.telefono;
        editClientForm.style.display = 'block';
    }

    // Ocultar formulario de edición
    cancelEditBtn.addEventListener('click', () => {
        editClientForm.style.display = 'none';
    });

    // Actualizar cliente
    editForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nombre = document.getElementById('edit-nombre').value;
        const telefono = document.getElementById('edit-telefono').value;

        const updatedCliente = { nombre, telefono };

        fetch(`https://localhost:7186/api/clientes/${editingClientId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedCliente),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la actualización');
            }
            return response.text(); // Intentar leer la respuesta como texto para evitar el error JSON vacío
        })
        .then(text => {
            if (text) {
                return JSON.parse(text);
            }
        })
        .then(() => {
            loadClientes();
            editClientForm.style.display = 'none';
        })
        .catch(error => console.error('Error al actualizar el cliente:', error));
    });

    // Agregar cliente
    addClientForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nombre = document.getElementById('nombre').value;
        const telefono = document.getElementById('telefono').value;

        const nuevoCliente = { nombre, telefono };

        fetch('https://localhost:7186/api/clientes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoCliente),
        })
        .then(response => response.json())
        .then(() => {
            loadClientes();
            addClientForm.reset();
        })
        .catch(error => console.error('Error al agregar el cliente:', error));
    });

    // Cargar clientes al iniciar
    loadClientes();
});
