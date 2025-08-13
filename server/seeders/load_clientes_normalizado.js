/*Responsible for loading normalized clients into the database*/
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { pool } from "../conexion_db.js";

export async function loadNormalizedClientsToDatabase() {
    const filePath = path.resolve('server/data/01_clientes_normalizado.csv');
    const clients = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", (row) => {
                clients.push([
                    row.id_cliente,
                    row.nombre_cliente.trim(),
                    row.numero_identificacion,
                    row.direccion.trim(),
                    row.telefono.trim(),
                    row.correo_electronico.trim()
                ]);
            })
            .on('end', async () => {
                try {
                    const sql = 'INSERT INTO clientes (id_cliente, nombre_cliente, numero_identificacion, direccion, telefono, correo_electronico) VALUES ? ON DUPLICATE KEY UPDATE nombre_cliente = VALUES(nombre_cliente), direccion = VALUES(direccion), telefono = VALUES(telefono), correo_electronico = VALUES(correo_electronico)';
                    const [result] = await pool.query(sql, [clients]);

                    console.log(`✅ Successfully inserted ${result.affectedRows} normalized clients.`);
                    resolve();
                } catch (error) {
                    console.error('❌ Error inserting normalized clients:', error.message);
                    reject(error);
                }
            })
            .on('error', (err) => {
                console.error('❌ Error reading normalized clients CSV file:', err.message);
                reject(err);
            });
    });
}
