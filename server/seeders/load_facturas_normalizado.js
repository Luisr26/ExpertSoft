/*Responsible for loading normalized invoices into the database*/
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { pool } from "../conexion_db.js";

export async function loadNormalizedInvoicesToDatabase() {
    const filePath = path.resolve('server/data/03_facturas_normalizado.csv');
    const invoices = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", (row) => {
                invoices.push([
                    row.id_factura,
                    row.numero_factura.trim(),
                    row.periodo_facturacion.trim(),
                    row.monto_facturado,
                    row.monto_pagado
                ]);
            })
            .on('end', async () => {
                try {
                    const sql = 'INSERT INTO facturas (id_factura, numero_factura, periodo_facturacion, monto_facturado, monto_pagado) VALUES ? ON DUPLICATE KEY UPDATE periodo_facturacion = VALUES(periodo_facturacion), monto_facturado = VALUES(monto_facturado), monto_pagado = VALUES(monto_pagado)';
                    const [result] = await pool.query(sql, [invoices]);

                    console.log(`✅ Successfully inserted ${result.affectedRows} normalized invoices.`);
                    resolve();
                } catch (error) {
                    console.error('❌ Error inserting normalized invoices:', error.message);
                    reject(error);
                }
            })
            .on('error', (err) => {
                console.error('❌ Error reading normalized invoices CSV file:', err.message);
                reject(err);
            });
    });
}
