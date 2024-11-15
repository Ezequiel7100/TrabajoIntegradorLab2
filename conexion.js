import mysql from 'mysql2';

// Crear la conexión
const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'consultorio_medico',
});

// Conectar a la base de datos
conexion.connect((error) => {
    if (error) {
        console.error('Error conectando a la base de datos:', error.stack);
        return;
    }
    console.log('Conexión a la base de datos correcta');
});

// Exportar la conexion para usarla en otros archivos
export default conexion;