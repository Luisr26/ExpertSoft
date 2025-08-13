/*Responsible for loading normalized transactions into the database*/
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { pool } from "../conexion_db.js";

export async function loadNormalizedTransactionsToDatabase() {
    const filePath = path.resolve('server/data/04_transacciones_normalizado.csv');
    const transactions = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", (row) => {
                transactions.push([
                    row.id_transaccion.trim(),
                    row.id_cliente,
                    row.id_plataforma,
                    row.id_factura,
                    row.fecha_hora_transaccion,
                    row.monto_transaccion,
                    row.estado_transaccion.trim(),
                    row.tipo_transaccion.trim()
                ]);
            })
            .on('end', async () => {
                try {
                    const sql = 'INSERT INTO transacciones (id_transaccion, id_cliente, id_plataforma, id_factura, fecha_hora_transaccion, monto_transaccion, estado_transaccion, tipo_transaccion) VALUES ? ON DUPLICATE KEY UPDATE id_cliente = VALUES(id_cliente), id_plataforma = VALUES(id_plataforma), id_factura = VALUES(id_factura), fecha_hora_transaccion = VALUES(fecha_hora_transaccion), monto_transaccion = VALUES(monto_transaccion), estado_transaccion = VALUES(estado_transaccion), tipo_transaccion = VALUES(tipo_transaccion)';
                    const [result] = await pool.query(sql, [transactions]);

                    console.log(`✅ Successfully inserted ${result.affectedRows} normalized transactions.`);
                    resolve();
                } catch (error) {
                    console.error('❌ Error inserting normalized transactions:', error.message);
                    reject(error);
                }
            })
            .on('error', (err) => {
                console.error('❌ Error reading normalized transactions CSV file:', err.message);
                reject(err);
            });
    });
}
