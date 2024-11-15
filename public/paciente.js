document.getElementById("volver").addEventListener("click" , () =>{
    document.location.href = "/index";
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


const params = new URLSearchParams(window.location.search);
const idPacienteSeleccionado = params.get("id_paciente");
document.addEventListener("DOMContentLoaded", async () => {
    // Obtener el id del paciente desde la URL

    console.log("ID del paciente seleccionado:", idPacienteSeleccionado);
    try {
        
        const res = await fetch(`http://localhost:3000/historial_paciente_completo?id_paciente=${idPacienteSeleccionado}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!res.ok) {
            throw new Error("Error en la consulta");
        }

        const datos = await res.json();
        const resultadoDiv = document.getElementById("historia-clinica");
        resultadoDiv.innerHTML = `<h2>Información del Paciente</h2>`;

        datos.forEach(item => {
            // Asignar los datos a variables
            const idProfesional = item.id_profesional;
            const idPaciente = item.id_paciente;
            const nombrePaciente = item.nombre_paciente;
            const alergia = item.alergia ? item.alergia : "No tiene alergias registradas";
            const alergiaDesde = formatFecha(item.alergia_desde) ? formatFecha(item.alergia_desde) : "Sin fecha";
            const alergiaHasta = formatFecha(item.alergia_hasta) ? formatFecha(item.alergia_hasta) : "Sin fecha";
            
            const habito = item.habito ? item.habito : "No tiene hábitos registrados";
            const habitoDesde = formatFecha(item.habito_desde) ? formatFecha(item.habito_desde) : "Sin fecha";
            const habitoHasta = formatFecha(item.habito_hasta) ? formatFecha(item.habito_hasta) : "Sin fecha";
            
            const antecedente = item.antecedente ? item.antecedente : "No tiene antecedentes registrados";
            const antecedenteDesde = formatFecha(item.antecedente_desde) ? formatFecha(item.antecedente_desde) : "Sin fecha";
            const antecedenteHasta = formatFecha(item.antecedente_hasta) ? formatFecha(item.antecedente_hasta) : "Sin fecha";
            
            const medicamento = item.medicamento ? item.medicamento : "No tiene medicamentos registrados";
        
            // Mostrar los datos en el DOM en formato de filas y columnas
            resultadoDiv.innerHTML += `
                <div>
                    <h3>Nombre Paciente: ${nombrePaciente}</h3> 
                    <h3>Alergias</h3>
                    <table border="1" cellspacing="0" cellpadding="5">
                        <tr>
                            <th>Alergia</th>
                            <th>Desde</th>
                            <th>Hasta</th>
                        </tr>
                        ${item.alergia ? `
                            <tr>
                                <td>${alergia}</td>
                                <td>${alergiaDesde}</td>
                                <td>${alergiaHasta}</td>
                            </tr>
                        ` : `<tr><td colspan="3">${alergia}</td></tr>`}
                    </table>
        
                    <h3>Hábitos</h3>
                    <table border="1" cellspacing="0" cellpadding="5">
                        <tr>
                            <th>Detalle</th>
                            <th>Desde</th>
                            <th>Hasta</th>
                        </tr>
                        ${item.habito ? `
                            <tr>
                                <td>${habito}</td>
                                <td>${habitoDesde}</td>
                                <td>${habitoHasta}</td>
                            </tr>
                        ` : `<tr><td colspan="3">${habito}</td></tr>`}
                    </table>
        
                    <h3>Antecedentes</h3>
                    <table border="1" cellspacing="0" cellpadding="5">
                        <tr>
                            <th>Detalle</th>
                            <th>Desde</th>
                            <th>Hasta</th>
                        </tr>
                        ${item.antecedente ? `
                            <tr>
                                <td>${antecedente}</td>
                                <td>${antecedenteDesde}</td>
                                <td>${antecedenteHasta}</td>
                            </tr>
                        ` : `<tr><td colspan="3">${antecedente}</td></tr>`}
                    </table>
        
                    <h3>Medicamentos</h3>
                    <table border="1" cellspacing="0" cellpadding="5">
                        <tr>
                            <th>Detalle</th>
                        </tr>
                        ${item.medicamento ? `
                            <tr>
                                <td>${medicamento}</td>
                            </tr>
                        ` : `<tr><td>${medicamento}</td></tr>`}
                    </table>
                </div>
            `;
        });

    } catch (error) {
        console.error("Error:", error);
        document.getElementById("historia-clinica").innerHTML = `<p>Hubo un error en la consulta</p>`;
    }
});


document.getElementById('form-habitos').addEventListener('submit', async (e) => {
    e.preventDefault();
    const detalle = document.getElementById('detalle-habito').value;
    const fecha_desde = document.getElementById('fecha-desde-habito').value;
    const fecha_hasta = document.getElementById('fecha-hasta-habito').value;
    const id_paciente = idPacienteSeleccionado; 
    
    await fetch('/habitos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ detalle, fecha_desde, fecha_hasta, id_paciente })
    });

    alert('Hábito guardado con éxito');
    document.getElementById('form-habitos').reset();
});

document.getElementById('form-antecedentes').addEventListener('submit', async (e) => {
    e.preventDefault();
    const detalle = document.getElementById('detalle-antecedente').value;
    const fecha_desde = document.getElementById('fecha-desde-antecedente').value;
    const fecha_hasta = document.getElementById('fecha-hasta-antecedente').value;
    const id_paciente =  idPacienteSeleccionado ;
    
    await fetch('/antecedentes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ detalle, fecha_desde, fecha_hasta, id_paciente })
    });

    alert('Antecedente guardado con éxito');
    document.getElementById('form-antecedentes').reset();
});


document.getElementById('form-medicamentos').addEventListener('submit', async (e) => {
    e.preventDefault();
    const detalle = document.getElementById('detalle-medicamento').value;
    const id_paciente =  idPacienteSeleccionado ;
    
    await fetch('/medicamentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ detalle, id_paciente })
    });

    alert('Medicamento guardado con éxito');
    document.getElementById('form-medicamentos').reset();
});

document.getElementById('form-alergias').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombre-alergia').value;
    const importancia = document.getElementById('importancia-alergia').value;
    const fecha_desde = document.getElementById('fecha-desde-alergia').value;
    const fecha_hasta = document.getElementById('fecha-hasta-alergia').value;
    const id_paciente =  idPacienteSeleccionado ;
    
    await fetch('/alergias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, importancia, fecha_desde, fecha_hasta, id_paciente })
    });

    alert('Alergia guardada con éxito');
    document.getElementById('form-alergias').reset();
});

document.getElementById('form-guardar').addEventListener('submit', function(event) {
    event.preventDefault();

    // Capturar valores del formulario
    const motivo = document.getElementById('motivo').value;
    const fecha = document.getElementById('fecha').value;
    const estado = document.getElementById('estado').value;
    const diagnostico = document.getElementById('diagnostico').value;
    const evolucion = quill.root.innerHTML; // Capturar contenido de Quill como HTML
    const fechaEvolucion = document.getElementById('fecha-evolucion').value; // Capturar fecha de evolución

    // Crear un objeto con los datos
    const consultaData = {
        motivo,
        fecha,
        estado,
        diagnostico,
        evolucion,
        fecha_evolucion: fechaEvolucion // Añadir fecha de evolución
    };

    // Enviar datos al servidor
    fetch('/guardar-consulta', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(consultaData)
    })
    .then(response => response.json())
    .then(data => {
        alert('Consulta guardada correctamente');
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Hubo un error al guardar la consulta');
    });
});
















