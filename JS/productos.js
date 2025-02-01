document.addEventListener('DOMContentLoaded', () => {
    const comidasLista = document.getElementById('comidas-lista');
    const bebidasLista = document.getElementById('bebidas-lista');
    const addComidaForm = document.getElementById('add-comida-form');
    const addBebidaForm = document.getElementById('add-bebida-form');

    // Cargar comidas y bebidas
    function loadComidas() {
        fetch('https://localhost:7186/api/comida')
            .then(response => response.json())
            .then(comidas => {
                comidasLista.innerHTML = '';
                comidas.forEach(comida => {
                    const comidaDiv = document.createElement('div');
                    comidaDiv.classList.add('menu-item');

                    comidaDiv.innerHTML = `
                        <h3>${comida.nombre}</h3>
                        <p><strong>Precio:</strong> $${comida.precio}</p>
                        <p><strong>Ingredientes:</strong> ${comida.ingredientes}</p>
                        <p><strong>Contiene Gluten:</strong> ${comida.conGluten ? 'Sí' : 'No'}</p>
                        <button class="eliminar-btn" data-id="${comida.id}">Eliminar</button>
                    `;

                    // Evento para eliminar comida
                    const eliminarBtn = comidaDiv.querySelector('.eliminar-btn');
                    eliminarBtn.addEventListener('click', () => {
                        eliminarProducto('comida', comida.id);
                    });

                    comidasLista.appendChild(comidaDiv);
                });
            });
    }

    function loadBebidas() {
        fetch('https://localhost:7186/api/bebidas')
            .then(response => response.json())
            .then(bebidas => {
                bebidasLista.innerHTML = '';
                bebidas.forEach(bebida => {
                    const bebidaDiv = document.createElement('div');
                    bebidaDiv.classList.add('menu-item');

                    bebidaDiv.innerHTML = `
                        <h3>${bebida.nombre}</h3>
                        <p><strong>Precio:</strong> $${bebida.precio}</p>
                        <p><strong>Descafeinado:</strong> ${bebida.esDescafeinado ? 'Sí' : 'No'}</p>
                        <button class="eliminar-btn" data-id="${bebida.id}">Eliminar</button>
                    `;

                    // Evento para eliminar bebida
                    const eliminarBtn = bebidaDiv.querySelector('.eliminar-btn');
                    eliminarBtn.addEventListener('click', () => {
                        eliminarProducto('bebida', bebida.id);
                    });

                    bebidasLista.appendChild(bebidaDiv);
                });
            });
    }

    function eliminarProducto(tipo, id) {
        let endpoint = tipo === 'bebida' ? 'bebidas' : 'comida'; // Asegura el endpoint correcto
    
        fetch(`https://localhost:7186/api/${endpoint}/${id}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error eliminando ${tipo}: ${response.statusText}`);
            }
            return response;
        })
        .then(() => {
            loadComidas();
            loadBebidas();
        })
        .catch(error => console.error('Error eliminando producto:', error));
    }

    // Agregar comida
    addComidaForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nombre = document.getElementById('nombre-comida').value;
        const precio = parseFloat(document.getElementById('precio-comida').value);
        const ingredientes = document.getElementById('ingredientes').value;
        const conGluten = document.getElementById('con-gluten').value === 'true';

        const nuevaComida = { nombre, precio, ingredientes, conGluten };

        fetch('https://localhost:7186/api/comida', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevaComida),
        })
        .then(() => {
            loadComidas();
            addComidaForm.reset();
        });
    });

    // Agregar bebida
    addBebidaForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nombre = document.getElementById('nombre-bebida').value;
        const precio = parseFloat(document.getElementById('precio-bebida').value);
        const esDescafeinado = document.getElementById('descafeinado').value === 'true';

        const nuevaBebida = { nombre, precio, esDescafeinado };

        fetch('https://localhost:7186/api/bebidas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevaBebida),
        })
        .then(() => {
            loadBebidas();
            addBebidaForm.reset();
        });
    });

    // Inicializar la carga de comidas y bebidas
    loadComidas();
    loadBebidas();
});
