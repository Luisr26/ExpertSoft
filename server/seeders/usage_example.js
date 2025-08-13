/*Example of how to use the seeders from the main server*/

import { loadAllData, verifyDataLoading } from './load_all_data.js';

// Example 1: Load all data at once
export async function initializeDatabase() {
    try {
        console.log('🚀 Initializing database with normalized data...');
        await loadAllData();
        console.log('✅ Database initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing database:', error.message);
        throw error;
    }
}

// Example 2: Verify data status
export async function verifyDatabaseStatus() {
    try {
        console.log('🔍 Verifying database status...');
        await verifyDataLoading();
        console.log('✅ Verification completed');
    } catch (error) {
        console.error('❌ Error verifying database:', error.message);
        throw error;
    }
}

// Example 3: Function to reinitialize database (useful for development)
export async function reinitializeDatabase() {
    try {
        console.log('🔄 Reinitializing database...');
        
        // Here you could add logic to clean tables first
        // const { pool } = await import('../conexion_db.js');
        // await pool.query('DELETE FROM transacciones');
        // await pool.query('DELETE FROM facturas');
        // await pool.query('DELETE FROM clientes');
        // await pool.query('DELETE FROM plataformas');
        
        await loadAllData();
        console.log('✅ Database reinitialized successfully');
    } catch (error) {
        console.error('❌ Error reinitializing database:', error.message);
        throw error;
    }
}

// Example usage in main server (index.js)
/*
import express from 'express';
import { initializeDatabase, verifyDatabaseStatus } from './seeders/usage_example.js';

const app = express();

// Route to initialize database (only in development)
if (process.env.NODE_ENV === 'development') {
    app.post('/api/init-db', async (req, res) => {
        try {
            await initializeDatabase();
            res.json({ message: 'Database initialized successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    app.get('/api/verify-db', async (req, res) => {
        try {
            await verifyDatabaseStatus();
            res.json({ message: 'Verification completed successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
}

app.listen(3000, async () => {
    console.log('🚀 Server started on port 3000');
    
    // Initialize database when starting server
    try {
        await initializeDatabase();
        console.log('✅ Database initialized when starting server');
    } catch (error) {
        console.error('❌ Error initializing database:', error.message);
    }
});
*/
