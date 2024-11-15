document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("cerrar").addEventListener("click", () => {
        document.location.href = "/";
    });

    const tablaProfesionales = document.getElementById('tabla-profesionales').querySelector('tbody');
    const formProfesional = document.getElementById('form-profesional');

    // Función para cargar la lista de profesionales
    async function cargarProfesionales() {
        const res = await fetch('http://localhost:3000/profesionales');
        const profesionales = await res.json();
        tablaProfesionales.innerHTML = profesionales.map(prof => `
            <tr>
                <td>${prof.id_profesional}</td>
                <td>${prof.nombre}</td>
                <td>${prof.usuario}</td>
                
            </tr>
        `).join('');
    }

    cargarProfesionales();

    // Manejar el envío del formulario para agregar o editar
    formProfesional.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('profesional-id').value;
        const nombre = document.getElementById('nombre').value;
        const usuario = document.getElementById('usuario').value;
        const contrasena = document.getElementById('contrasena').value;
        
        const method = id ? 'PUT' : 'POST';
        const url = id ? `/profesionales/${id}` : '/profesionales';

        await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, usuario, contrasena })
        });

        cargarProfesionales();
        formProfesional.reset();
    });

});