import mysql from "mysql2/promise"

export const pool = mysql.createPool({
    host: "localhost",
    database: "ExpertSoft",
    port: 3306,
    user: "root",
    password: "Qwe.123*",
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0
})


async function probarConexionConLaBaseDeDatos() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Conexión a la base de datos exitosa');
        connection.release();
    } catch (error) {
        console.error('❌ Error al conectar con la base de datos:', error.message);
    }
}

probarConexionConLaBaseDeDatos();