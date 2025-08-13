/*Responsible for loading platforms into the database*/
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { pool } from "../conexion_db.js";

export async function loadPlatformsToDatabase() {
    const filePath = path.resolve('server/data/02_plataformas_normalizado.csv');
    const platforms = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", (row) => {
                platforms.push([
                    row.id_plataforma,
                    row.nombre_plataforma.trim()
                ]);
            })
            .on('end', async () => {
                try {
                    const sql = 'INSERT INTO plataformas (id_plataforma, nombre_plataforma) VALUES ? ON DUPLICATE KEY UPDATE nombre_plataforma = VALUES(nombre_plataforma)';
                    const [result] = await pool.query(sql, [platforms]);

                    console.log(`✅ Successfully inserted ${result.affectedRows} platforms.`);
                    resolve();
                } catch (error) {
                    console.error('❌ Error inserting platforms:', error.message);
                    reject(error);
                }
            })
            .on('error', (err) => {
                console.error('❌ Error reading platforms CSV file:', err.message);
                reject(err);
            });
    });
}
