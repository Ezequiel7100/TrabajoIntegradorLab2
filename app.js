
import express from 'express';
import conexion from './conexion.js';
import { router } from './routers/rutas.js';
import {metodo as autenticacion} from "./controles/controlador.js";
import session from 'express-session';
import dotenv from 'dotenv'; 

dotenv.config();
const app = express();


app.use(session({ 
    secret: process.env.SESSION_SECRET, 
    resave: false, saveUninitialized: false, 
    cookie: { 
        maxAge: 1000 * 60 * 60 * 2, 
        secure: false 
    } 
}));
/*
app.use(session({
    secret: 'clave_', 
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false } // Cambiar a true en producción con HTTPS
}));*/

//servidor
const port = process.env.PORT || 3000; 
app.set("port",port);
app.listen(app.get("port"));
console.log("Servidor corriendo en puerto",app.get("port"));



//configuracion
app.set("view engine", "ejs");
app.use(express.json());

app.use(express.static('public'));
app.get('/', router);
app.get('/index', router);
app.get('/historial_paciente', router);
app.get('/admin_panel', router);
app.post('/api/login',autenticacion.login);


//rutas

app.get('/consultas', (req, res) => {
    const id_profesional = req.session.id_profesional;
    const consulta = `
  SELECT 
    c.id_consulta, 
    c.fecha, 
    c.motivo, 
    c.estado, 
    p.nombre AS nombre_paciente, 
    p.id_paciente, 
    pr.id_profesional, 
    pr.nombre AS nombre_profesional 
  FROM 
    consultorio_medico.consultas c 
  JOIN 
    consultorio_medico.profesionales pr ON c.id_profesional = pr.id_profesional 
  JOIN 
    consultorio_medico.pacientes p ON c.id_paciente = p.id_paciente 
  WHERE 
    pr.id_profesional = ?;
`;
    conexion.query(consulta, [id_profesional],(error, resultados) => {
        if (error) {
            return res.status(500).send({ error: 'Error en la base de datos' });
        }

        res.json(resultados); // Enviar los resultados de la consulta como JSON
    });
});


app.get('/historial_paciente_completo', (req, res) => {
    const { id_paciente } = req.query;
    const consulta = `
  SELECT 
    p.id_paciente, 
    p.nombre AS nombre_paciente, 
    p.fecha_nacimiento, 
    a.nombre AS alergia, 
    a.fecha_desde AS alergia_desde, 
    a.fecha_hasta AS alergia_hasta, 
    h.detalle AS habito, 
    h.fecha_desde AS habito_desde, 
    h.fecha_hasta AS habito_hasta, 
    an.detalle AS antecedente, 
    an.fecha_desde AS antecedente_desde, 
    an.fecha_hasta AS antecedente_hasta, 
    m.detalle AS medicamento, 
    prof.id_profesional AS id_profesional, 
  FROM pacientes p
  LEFT JOIN alergias a ON p.id_paciente = a.id_paciente
  LEFT JOIN habitos h ON p.id_paciente = h.id_paciente
  LEFT JOIN antecedentes an ON p.id_paciente = an.id_paciente
  LEFT JOIN medicamentos m ON p.id_paciente = m.id_paciente
  LEFT JOIN consultas c ON p.id_paciente = c.id_paciente
  LEFT JOIN profesionales prof ON c.id_profesional = prof.id_profesional
  WHERE p.id_paciente = ?;
`;
    
    console.log("ID del paciente recibido:", id_paciente);
    conexion.query(consulta, [id_paciente], (error, resultados) => {
        if (error) {

            return res.status(500).send({ error: 'Error en la base de datos' });
        }

        res.json(resultados); // Enviar los resultados de la consulta como JSON
    });
});



// Crear profesional
app.post('/profesionales', (req, res) => {
    const { nombre, usuario, contrasena } = req.body;
    const query = 'INSERT INTO `profesionales`( `nombre`, `usuario`, `contrasena`) VALUES (?,?,?)';
    conexion.query(query, [nombre, usuario, contrasena], (error, resultado) => {
        if (error) return res.status(500).send({ error: 'Error en la base de datos' });
        res.send({ mensaje: 'Profesional agregado exitosamente' });
    });
});


// Consultar todos los profesionales
app.get('/profesionales', (req, res) => {
    const query = 'SELECT * FROM profesionales';
    conexion.query(query, (error, resultados) => {
        if (error) return res.status(500).send({ error: 'Error en la base de datos' });
        res.json(resultados);
    });
});

app.post('/habitos', (req, res) => { 
    const { detalle, fecha_desde, fecha_hasta, id_paciente } = req.body; 
    const query = 'INSERT INTO habitos (detalle, fecha_desde, fecha_hasta, id_paciente) VALUES (?, ?, ?, ?)'; 
    conexion.query(query, [detalle, fecha_desde, fecha_hasta, id_paciente], (error, resultado) => { 
        if (error) return res.status(500).send({ error: 'Error en la base de datos' }); 
        res.send({ mensaje: 'Hábito guardado exitosamente' }); 
    }); 
});

app.post('/antecedentes', (req, res) => {
    const { detalle, fecha_desde, fecha_hasta, id_paciente } = req.body;
    const query = 'INSERT INTO antecedentes (detalle, fecha_desde, fecha_hasta, id_paciente) VALUES (?, ?, ?, ?)';
    conexion.query(query, [detalle, fecha_desde, fecha_hasta, id_paciente], (error, resultado) => {
        if (error) return res.status(500).send({ error: 'Error en la base de datos' });
        res.send({ mensaje: 'Antecedente guardado exitosamente' });
    });
});


app.post('/medicamentos', (req, res) => {
    const { detalle, id_paciente } = req.body;
    const query = 'INSERT INTO medicamentos (detalle, id_paciente) VALUES (?, ?)';
    conexion.query(query, [detalle, id_paciente], (error, resultado) => {
        if (error) return res.status(500).send({ error: 'Error en la base de datos' });
        res.send({ mensaje: 'Medicamento guardado exitosamente' });
    });
});
app.post('/alergias', (req, res) => {
    const { nombre, importancia, fecha_desde, fecha_hasta, id_paciente } = req.body;
    const query = 'INSERT INTO alergias (nombre, importancia, fecha_desde, fecha_hasta, id_paciente) VALUES (?, ?, ?, ?, ?)';
    conexion.query(query, [nombre, importancia, fecha_desde, fecha_hasta, id_paciente], (error, resultado) => {
        if (error) {
            return res.status(500).send({ error: 'Error en la base de datos' });
        }
        res.send({ mensaje: 'Alergia guardada exitosamente' });
    });
});

app.post('/guardar-consulta', (req, res) => {
    const { motivo, fecha, estado, diagnostico, evolucion, fecha_evolucion } = req.body;

    // Insertar en la tabla de consultas
    const consultaQuery = `INSERT INTO consultas (motivo, fecha, estado) VALUES (?, ?, ?)`;
    conexion.query(consultaQuery, [motivo, fecha, estado], (err, result) => {
        if (err) throw err;

        const consultaId = result.insertId;

        // Insertar diagnóstico asociado
        const diagnosticoQuery = `INSERT INTO diagnosticos (id_consulta, diagnostico) VALUES (?, ?)`;
        conexion.query(diagnosticoQuery, [consultaId, diagnostico], (err) => {
            if (err) throw err;

            // Insertar evolución asociada con la fecha de evolución específica
            const evolucionQuery = `INSERT INTO evoluciones (id_consulta, nota_clinica, fecha, es_editable) VALUES (?, ?, ?, 1)`;
            conexion.query(evolucionQuery, [consultaId, evolucion, fecha_evolucion], (err) => {
                if (err) throw err;
                
                res.json({ mensaje: 'Consulta guardada correctamente' });
            });
        });
    });
});











/*
app.post('/consultas', (req, res) => {
    const { motivo, diagnostico, evolucion, id_profesional, id_paciente, estado } = req.body;
    const queryConsulta = 'INSERT INTO consultas (motivo, id_profesional, id_paciente, estado) VALUES (?, ?, ?, ?)';
    const queryDiagnostico = 'INSERT INTO diagnosticos (id_consulta, diagnostico) VALUES (?, ?)';
    const queryEvolucion = 'INSERT INTO evoluciones (id_consulta, nota_clinica) VALUES (?, ?)';

    conexion.query(queryConsulta, [motivo, id_profesional, id_paciente, estado], (error, resultado) => {
        if (error) return res.status(500).send({ error: 'Error en la base de datos al guardar la consulta' });
        const idConsulta = resultado.insertId;
        
        conexion.query(queryDiagnostico, [idConsulta, diagnostico], (error) => {
            if (error) return res.status(500).send({ error: 'Error en la base de datos al guardar el diagnóstico' });
            
            conexion.query(queryEvolucion, [idConsulta, evolucion], (error) => {
                if (error) return res.status(500).send({ error: 'Error en la base de datos al guardar la evolución' });
                
                res.send({ mensaje: 'Consulta creada exitosamente con diagnóstico y evolución' });
            });
        });
    });
});
*/