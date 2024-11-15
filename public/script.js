
document.getElementById("cerrar").addEventListener("click", () => {
    document.location.href = "/";
});

// Función para formatear la fecha a DD-MM-AAAA
function formatFecha(fecha) { 
    if (!fecha) return null; 
    const date = new Date(fecha); 
    const dia = date.getDate().toString().padStart(2, '0'); 
    const mes = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const año = date.getFullYear(); 
    return `${dia}-${mes}-${año}`; 
}

document.addEventListener("DOMContentLoaded", async () => {
    try {
        // Hacer la solicitud al servidor para obtener el nombre del profesional
        const res = await fetch(`http://localhost:3000/consultas`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include'
        });

        if (!res.ok) throw new Error("Error en la consulta");

        const datos = await res.json();


         // Mostrar el nombre del doctor
        if (datos.length > 0) {
            const nombre = document.getElementById("nombreDoctor");
            nombre.innerHTML = `<h2>Bienvenido Dr. ${datos[0].nombre_profesional}</h2>`;
        }
        
        
        // Mostrar los datos en el DOM
        const resultadoDiv = document.getElementById("resultado");

        if (datos.length === 0) {
            resultadoDiv.innerHTML = `<p>No hay pacientes registrados para este profesional.</p>`;
        } else {
            resultadoDiv.innerHTML = `
                <h2>Buscar Por Fecha</h2>
                <label for="fecha">Fecha:</label>
                <input type="date" id="fecha" name="fecha">
                <button id="btnBuscar">Buscar</button>
                <h2>Agenda de Hoy</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Paciente</th>
                            <th>Fecha</th>
                            <th>Motivo</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${datos.map(item => `
                            <tr>
                                <td>${item.nombre_paciente}</td>
                                <td>${formatFecha(item.fecha)}</td>
                                <td>${item.motivo}</td>
                                <td>${item.estado}</td>
                                <td><a href="#" class="btn ver-historial" data-id="${item.id_paciente}">Ver Historia</a></td>
                            </tr>`).join('')}
                    </tbody>
                </table>
            `;

            // Delegar evento click para "Ver Historia"
            resultadoDiv.addEventListener("click", (event) => {
                if (event.target.classList.contains("ver-historial")) {
                    event.preventDefault();
                    const idPaciente = event.target.getAttribute("data-id");
                    document.location.href = `/historial_paciente?id_paciente=${idPaciente}`;
                }
            });

            // Evento para buscar por fecha
            document.getElementById("btnBuscar").addEventListener("click", () => { 
                const fechaSeleccionada = document.getElementById("fecha").value; 
                const resultadosFiltrados = datos.filter(item => { 
                    const fechaItem = new Date(item.fecha).toISOString().split('T')[0]; 
                    return fechaItem === fechaSeleccionada; 
                });
                
                const tbody = resultadoDiv.querySelector("tbody"); 
                tbody.innerHTML = resultadosFiltrados.length > 0 ? resultadosFiltrados.map(item => ` 
                    <tr> 
                        <td>${item.nombre_paciente}</td> 
                        <td>${formatFecha(item.fecha)}</td> 
                        <td>${item.motivo}</td> 
                        <td>${item.estado}</td> 
                        <td><a href="#" class="btn ver-historial" data-id="${item.id_paciente}">Ver Historia</a></td> 
                    </tr>`).join('') : `<tr><td colspan="5">No hay resultados para la fecha seleccionada.</td></tr>`; 
            });
        }
    } catch (error) {
        console.error("Error:", error);
        document.getElementById("resultado").innerHTML = `<p>Hubo un error en la consulta</p>`;
    }
});


























/*
document.getElementById("cerrar").addEventListener("click", ()=>{
    document.location.href = "/";
})

// Función para formatear la fecha a DD-MM-AAAA 
function formatFecha(fecha) { 
    if (!fecha) return null; 
    // Si no hay fecha, retorna null 
        const date = new Date(fecha); 
        const dia = date.getDate().toString().padStart(2, '0'); 
        const mes = (date.getMonth() + 1).toString().padStart(2, '0'); 
        const año = date.getFullYear(); 
    return `${dia}-${mes}-${año}`; 
}

document.addEventListener("DOMContentLoaded", async () => {
    
    const nombre = document.getElementById("nombreDoctor")

    nombre.innerHTML = innerHTML = ` ${datos.map(item => `<h2>Bienvenido Dr. ${item.nombre_paciente}`)}`;

})

document.getElementById("consulta").addEventListener("click", async (e) => {
    e.preventDefault();
    

    try {
        // Hacer la solicitud al servidor usando el id del profesional
        const res = await fetch(`http://localhost:3000/consultas`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include'
        });

        // Verificar si la respuesta fue exitosa
        if (!res.ok) {
            throw new Error("Error en la consulta");
        }

        // Convertir la respuesta en un objeto JSON
        const datos = await res.json();
        
        // Mostrar los datos en el DOM
        const resultadoDiv = document.getElementById("resultado");
        
            
        
        if (datos.length === 0) {
            resultadoDiv.innerHTML = `<p>No hay pacientes registrados para este profesional.</p>`;
        } else {
            resultadoDiv.innerHTML = `
              <h2>Buscar Por Fecha</h2>
        <label for="fecha">Fecha:</label>
        <input type="date" id="fecha" name="fecha">
        <button id="btnBuscar">Buscar</button>
                <h2>Agenda de Hoy</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Paciente</th>
                            <th>Fecha</th>
                            <th>Motivo</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${datos.map(item => `
                            <tr>
                                <td>${item.nombre_paciente}</td>
                                <td>${formatFecha(item.fecha)}</td>
                                <td>${item.motivo}</td>
                                <td>${item.estado}</td>
                                <td><a href="#" class="btn ver-historial" data-id="${item.id_paciente}">Ver Historia</a></td>
                            </tr>`).join('')}
                    </tbody>
                </table>
            `;

            // Delegar el evento click para los botones "Ver Historia"
            resultadoDiv.addEventListener("click", (event) => {
                if (event.target.classList.contains("ver-historial")) {
                    event.preventDefault();
                    const idPaciente = event.target.getAttribute("data-id");

                    document.location.href = `/historial_paciente?id_paciente=${idPaciente}`;
                }
            });
            document.getElementById("btnBuscar").addEventListener("click", () => { 
                const fechaSeleccionada = document.getElementById("fecha").value; 
                const resultadosFiltrados = datos.filter(item => { 
                    const fechaItem = new Date(item.fecha).toISOString().split('T')[0]; 
                return fechaItem === fechaSeleccionada; }); 
                    
                    const tbody = resultadoDiv.querySelector("tbody"); 
                    tbody.innerHTML = resultadosFiltrados.length > 0 ? resultadosFiltrados.map(item => ` 
                        <tr> 
                            <td>${item.nombre_paciente}</td> 
                            <td>${item.fecha}</td> 
                            <td>${item.motivo}</td> 
                            <td>${item.estado}</td> 
                            <td><a href="#" class="btn ver-historial" data-id="${item.id_paciente}">Ver Historia</a></td> </tr>`)
                            .join('') : `
                            <tr><td colspan="5">No hay resultados para la fecha seleccionada.</td></tr>`; 
                });
        }

    } catch (error) {
        console.error("Error:", error);
        document.getElementById("resultado").innerHTML = `<p>Hubo un error en la consulta</p>`;
    }
});
*/