import cors from "cors"
import express from "express"
import { pool } from "./conexion_db.js"

const app = express()
app.use(cors()) // this allows the backend application to be consumed by a frontend application
app.use(express.json()) // allows Express to automatically interpret the body in JSON when you receive a POST or PUT request.

// =====================================================
// ENDPOINTS FOR PLATFORMS
// =====================================================

// GET - Get all platforms
app.get('/platforms', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM plataformas ORDER BY id_plataforma');
        res.json(rows);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
});

// GET - Get platform by ID
app.get('/platforms/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query('SELECT * FROM plataformas WHERE id_plataforma = ?', [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                endpoint: req.originalUrl,
                method: req.method,
                message: 'Platform not found'
            });
        }
        
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
});

// POST - Create new platform
app.post('/platforms', async (req, res) => {
    try {
        const { nombre_plataforma } = req.body;

        const query = `
        INSERT INTO plataformas 
        (nombre_plataforma)
        VALUES (?)
        `
        const values = [nombre_plataforma]

        const [result] = await pool.query(query, values)

        res.status(201).json({
            message: "Platform created successfully"
        })
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
})

// PUT - Update platform
app.put('/platforms/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { nombre_plataforma } = req.body

        const query = `
        UPDATE plataformas SET 
            nombre_plataforma = ?
        WHERE id_plataforma = ?
        `
        const values = [nombre_plataforma, id]

        const [result] = await pool.query(query, values)

        if (result.affectedRows != 0) {
            return res.json({ message: "Platform updated successfully" })
        }
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
})

// DELETE - Delete platform
app.delete('/platforms/:id', async (req, res) => {
    try {
        const { id } = req.params

        const query = `
        DELETE FROM plataformas WHERE id_plataforma = ?
        `
        const values = [id]

        const [result] = await pool.query(query, values)

        if (result.affectedRows != 0) {
            return res.json({ message: "Platform deleted successfully" })
        }
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
})

// =====================================================
// ENDPOINTS FOR CLIENTS
// =====================================================

// GET - Get all clients
app.get('/clients', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM clientes ORDER BY nombre_cliente');
        res.json(rows);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
});

// GET - Get client by ID
app.get('/clients/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query('SELECT * FROM clientes WHERE id_cliente = ?', [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                endpoint: req.originalUrl,
                method: req.method,
                message: 'Client not found'
            });
        }
        
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
});

// GET - Get transactions for a specific client
app.get('/clients/:id/transactions', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query(`
            SELECT 
                t.*,
                p.nombre_plataforma,
                f.numero_factura,
                f.periodo_facturacion,
                f.monto_facturado,
                f.monto_pagado
            FROM transacciones t
            INNER JOIN plataformas p ON t.id_plataforma = p.id_plataforma
            INNER JOIN facturas f ON t.id_factura = f.id_factura
            WHERE t.id_cliente = ?
            ORDER BY t.fecha_hora_transaccion DESC
        `, [id]);
        
        res.json(rows);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
});

// POST - Create new client
app.post('/clients', async (req, res) => {
    try {
        const {
            nombre_cliente,
            numero_identificacion,
            direccion,
            telefono,
            correo_electronico
        } = req.body

        const query = `
        INSERT INTO clientes 
        (nombre_cliente, numero_identificacion, direccion, telefono, correo_electronico)
        VALUES (?, ?, ?, ?, ?)
        `
        const values = [
            nombre_cliente,
            numero_identificacion,
            direccion,
            telefono,
            correo_electronico
        ]

        const [result] = await pool.query(query, values)

        res.status(201).json({
            message: "Client created successfully"
        })
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
})

// PUT - Update client
app.put('/clients/:id', async (req, res) => {
    try {
        const { id } = req.params

        const {
            nombre_cliente,
            numero_identificacion,
            direccion,
            telefono,
            correo_electronico
        } = req.body

        const query = `
        UPDATE clientes SET 
            nombre_cliente = ?,
            numero_identificacion = ?,
            direccion = ?,
            telefono = ?,
            correo_electronico = ?
        WHERE id_cliente = ?
        `
        const values = [
            nombre_cliente,
            numero_identificacion,
            direccion,
            telefono,
            correo_electronico,
            id
        ]

        const [result] = await pool.query(query, values)

        if (result.affectedRows != 0) {
            return res.json({ message: "Client updated successfully" })
        }
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
})

// DELETE - Delete client
app.delete('/clients/:id', async (req, res) => {
    try {
        const { id } = req.params

        const query = `
        DELETE FROM clientes WHERE id_cliente = ?
        `
        const values = [id]

        const [result] = await pool.query(query, values)

        if (result.affectedRows != 0) {
            return res.json({ message: "Client deleted successfully" })
        }
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
})

// =====================================================
// ENDPOINTS FOR INVOICES
// =====================================================

// GET - Get all invoices
app.get('/invoices', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM facturas ORDER BY periodo_facturacion DESC, numero_factura');
        res.json(rows);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
});

// GET - Get invoice by ID
app.get('/invoices/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query('SELECT * FROM facturas WHERE id_factura = ?', [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                endpoint: req.originalUrl,
                method: req.method,
                message: 'Invoice not found'
            });
        }
        
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
});

// POST - Create new invoice
app.post('/invoices', async (req, res) => {
    try {
        const {
            numero_factura,
            periodo_facturacion,
            monto_facturado,
            monto_pagado
        } = req.body

        const query = `
        INSERT INTO facturas 
        (numero_factura, periodo_facturacion, monto_facturado, monto_pagado)
        VALUES (?, ?, ?, ?)
        `
        const values = [
            numero_factura,
            periodo_facturacion,
            monto_facturado,
            monto_pagado
        ]

        const [result] = await pool.query(query, values)

        res.status(201).json({
            message: "Invoice created successfully"
        })
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
})

// PUT - Update invoice
app.put('/invoices/:id', async (req, res) => {
    try {
        const { id } = req.params

        const {
            numero_factura,
            periodo_facturacion,
            monto_facturado,
            monto_pagado
        } = req.body

        const query = `
        UPDATE facturas SET 
            numero_factura = ?,
            periodo_facturacion = ?,
            monto_facturado = ?,
            monto_pagado = ?
        WHERE id_factura = ?
        `
        const values = [
            numero_factura,
            periodo_facturacion,
            monto_facturado,
            monto_pagado,
            id
        ]

        const [result] = await pool.query(query, values)

        if (result.affectedRows != 0) {
            return res.json({ message: "Invoice updated successfully" })
        }
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
})

// DELETE - Delete invoice
app.delete('/invoices/:id', async (req, res) => {
    try {
        const { id } = req.params

        const query = `
        DELETE FROM facturas WHERE id_factura = ?
        `
        const values = [id]

        const [result] = await pool.query(query, values)

        if (result.affectedRows != 0) {
            return res.json({ message: "Invoice deleted successfully" })
        }
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
})

// =====================================================
// ENDPOINTS FOR TRANSACTIONS
// =====================================================

// GET - Get all transactions
app.get('/transactions', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                t.*,
                c.nombre_cliente,
                c.numero_identificacion,
                p.nombre_plataforma,
                f.numero_factura,
                f.periodo_facturacion,
                f.monto_facturado,
                f.monto_pagado
            FROM transacciones t
            INNER JOIN clientes c ON t.id_cliente = c.id_cliente
            INNER JOIN plataformas p ON t.id_plataforma = p.id_plataforma
            INNER JOIN facturas f ON t.id_factura = f.id_factura
            ORDER BY t.fecha_hora_transaccion DESC
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
});

// GET - Get transaction by ID
app.get('/transactions/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query(`
            SELECT 
                t.*,
                c.nombre_cliente,
                c.numero_identificacion,
                c.correo_electronico,
                p.nombre_plataforma,
                f.numero_factura,
                f.periodo_facturacion,
                f.monto_facturado,
                f.monto_pagado
            FROM transacciones t
            INNER JOIN clientes c ON t.id_cliente = c.id_cliente
            INNER JOIN plataformas p ON t.id_plataforma = p.id_plataforma
            INNER JOIN facturas f ON t.id_factura = f.id_factura
            WHERE t.id_transaccion = ?
        `, [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                endpoint: req.originalUrl,
                method: req.method,
                message: 'Transaction not found'
            });
        }
        
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
});

// POST - Create new transaction
app.post('/transactions', async (req, res) => {
    try {
        const {
            id_transaccion,
            id_cliente,
            id_plataforma,
            id_factura,
            fecha_hora_transaccion,
            monto_transaccion,
            estado_transaccion,
            tipo_transaccion
        } = req.body

        const query = `
        INSERT INTO transacciones 
        (id_transaccion, id_cliente, id_plataforma, id_factura, fecha_hora_transaccion, monto_transaccion, estado_transaccion, tipo_transaccion)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `
        const values = [
            id_transaccion,
            id_cliente,
            id_plataforma,
            id_factura,
            fecha_hora_transaccion,
            monto_transaccion,
            estado_transaccion,
            tipo_transaccion
        ]

        const [result] = await pool.query(query, values)

        res.status(201).json({
            message: "Transaction created successfully"
        })
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
})

// PUT - Update transaction
app.put('/transactions/:id', async (req, res) => {
    try {
        const { id } = req.params

        const {
            id_cliente,
            id_plataforma,
            id_factura,
            fecha_hora_transaccion,
            monto_transaccion,
            estado_transaccion,
            tipo_transaccion
        } = req.body

        const query = `
        UPDATE transacciones SET 
            id_cliente = ?,
            id_plataforma = ?,
            id_factura = ?,
            fecha_hora_transaccion = ?,
            monto_transaccion = ?,
            estado_transaccion = ?,
            tipo_transaccion = ?
        WHERE id_transaccion = ?
        `
        const values = [
            id_cliente,
            id_plataforma,
            id_factura,
            fecha_hora_transaccion,
            monto_transaccion,
            estado_transaccion,
            tipo_transaccion,
            id
        ]

        const [result] = await pool.query(query, values)

        if (result.affectedRows != 0) {
            return res.json({ message: "Transaction updated successfully" })
        }
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
})

// DELETE - Delete transaction
app.delete('/transactions/:id', async (req, res) => {
    try {
        const { id } = req.params

        const query = `
        DELETE FROM transacciones WHERE id_transaccion = ?
        `
        const values = [id]

        const [result] = await pool.query(query, values)

        if (result.affectedRows != 0) {
            return res.json({ message: "Transaction deleted successfully" })
        }
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
})

// =====================================================
// INITIALIZATION ENDPOINTS (DEVELOPMENT ONLY)
// =====================================================

if (process.env.NODE_ENV === 'development') {
    // POST - Initialize database with seeders
    app.post('/init-db', async (req, res) => {
        try {
            const { loadAllData } = await import('./seeders/load_all_data.js');
            await loadAllData();
            
            res.json({
                message: "Database initialized successfully"
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                endpoint: req.originalUrl,
                method: req.method,
                message: error.message
            });
        }
    });
    
    // GET - Verify database status
    app.get('/verify-db', async (req, res) => {
        try {
            const { verifyDataLoading } = await import('./seeders/load_all_data.js');
            await verifyDataLoading();
            
            res.json({
                message: "Database verification completed successfully"
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                endpoint: req.originalUrl,
                method: req.method,
                message: error.message
            });
        }
    });
}

// =====================================================
// ERROR HANDLING MIDDLEWARE
// =====================================================

// 404 - Route not found
app.use('*', (req, res) => {
    res.status(404).json({
        status: 'error',
        endpoint: req.originalUrl,
        method: req.method,
        message: 'Route not found'
    });
});

// Global error handling middleware
app.use((error, req, res, next) => {
    console.error('Error:', error);
    res.status(500).json({
        status: 'error',
        endpoint: req.originalUrl,
        method: req.method,
        message: 'Internal server error'
    });
});

// =====================================================
// START SERVER
// =====================================================

// Server startup when everything is ready
app.listen(3000, () => {
    console.log("Server ready successfully at http://localhost:3000");
    console.log("📋 Available endpoints:");
    console.log("   - GET/POST/PUT/DELETE  /platforms");
    console.log("   - GET/POST/PUT/DELETE  /clients");
    console.log("   - GET/POST/PUT/DELETE  /invoices");
    console.log("   - GET/POST/PUT/DELETE  /transactions");
    console.log("   - GET  /clients/:id/transactions");
})

export default app;
