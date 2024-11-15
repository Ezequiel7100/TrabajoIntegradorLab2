import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();
// Crear la conexión
const conexion = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
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