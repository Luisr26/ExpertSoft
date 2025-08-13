import cors from "cors"
import express from "express"
import { pool } from "./conexion_db.js"

const app = express()
app.use(cors()) // esto permite que la aplicacion backend pueda ser consumida por una aplicacion frontend
app.use(express.json()) // permite que Express interprete automáticamente el body en JSON cuando recibes una petición POST o PUT.

// =====================================================
// ENDPOINTS PARA PLATAFORMAS
// =====================================================

// GET - Obtener todas las plataformas
app.get('/plataformas', async (req, res) => {
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

// GET - Obtener plataforma por ID
app.get('/plataformas/:id', async (req, res) => {
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

// POST - Crear nueva plataforma
app.post('/plataformas', async (req, res) => {
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
            mensaje: "plataforma creada exitosamente"
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

// PUT - Actualizar plataforma
app.put('/plataformas/:id', async (req, res) => {
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
            return res.json({ mensaje: "plataforma actualizada" })
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

// DELETE - Eliminar plataforma
app.delete('/plataformas/:id', async (req, res) => {
    try {
        const { id } = req.params

        const query = `
        DELETE FROM plataformas WHERE id_plataforma = ?
        `
        const values = [id]

        const [result] = await pool.query(query, values)

        if (result.affectedRows != 0) {
            return res.json({ mensaje: "plataforma eliminada" })
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
// ENDPOINTS PARA CLIENTES
// =====================================================

// GET - Obtener todos los clientes
app.get('/clientes', async (req, res) => {
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

// GET - Obtener cliente por ID
app.get('/clientes/:id', async (req, res) => {
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

// GET - Obtener transacciones de un cliente específico
app.get('/clientes/:id/transacciones', async (req, res) => {
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

// POST - Crear nuevo cliente
app.post('/clientes', async (req, res) => {
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
            mensaje: "cliente creado exitosamente"
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

// PUT - Actualizar cliente
app.put('/clientes/:id', async (req, res) => {
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
            return res.json({ mensaje: "cliente actualizado" })
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

// DELETE - Eliminar cliente
app.delete('/clientes/:id', async (req, res) => {
    try {
        const { id } = req.params

        const query = `
        DELETE FROM clientes WHERE id_cliente = ?
        `
        const values = [id]

        const [result] = await pool.query(query, values)

        if (result.affectedRows != 0) {
            return res.json({ mensaje: "cliente eliminado" })
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
// ENDPOINTS PARA FACTURAS
// =====================================================

// GET - Obtener todas las facturas
app.get('/facturas', async (req, res) => {
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

// GET - Obtener factura por ID
app.get('/facturas/:id', async (req, res) => {
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

// POST - Crear nueva factura
app.post('/facturas', async (req, res) => {
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
            mensaje: "factura creada exitosamente"
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

// PUT - Actualizar factura
app.put('/facturas/:id', async (req, res) => {
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
            return res.json({ mensaje: "factura actualizada" })
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

// DELETE - Eliminar factura
app.delete('/facturas/:id', async (req, res) => {
    try {
        const { id } = req.params

        const query = `
        DELETE FROM facturas WHERE id_factura = ?
        `
        const values = [id]

        const [result] = await pool.query(query, values)

        if (result.affectedRows != 0) {
            return res.json({ mensaje: "factura eliminada" })
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
// ENDPOINTS PARA TRANSACCIONES
// =====================================================

// GET - Obtener todas las transacciones
app.get('/transacciones', async (req, res) => {
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

// GET - Obtener transacción por ID
app.get('/transacciones/:id', async (req, res) => {
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

// POST - Crear nueva transacción
app.post('/transacciones', async (req, res) => {
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
            mensaje: "transacción creada exitosamente"
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

// PUT - Actualizar transacción
app.put('/transacciones/:id', async (req, res) => {
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
            return res.json({ mensaje: "transacción actualizada" })
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

// DELETE - Eliminar transacción
app.delete('/transacciones/:id', async (req, res) => {
    try {
        const { id } = req.params

        const query = `
        DELETE FROM transacciones WHERE id_transaccion = ?
        `
        const values = [id]

        const [result] = await pool.query(query, values)

        if (result.affectedRows != 0) {
            return res.json({ mensaje: "transacción eliminada" })
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
// ENDPOINTS PARA INICIALIZACIÓN (SOLO EN DESARROLLO)
// =====================================================

if (process.env.NODE_ENV === 'development') {
    // POST - Inicializar base de datos con seeders
    app.post('/init-db', async (req, res) => {
        try {
            const { loadAllData } = await import('./seeders/load_all_data.js');
            await loadAllData();
            
            res.json({
                mensaje: "Base de datos inicializada exitosamente"
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
    
    // GET - Verificar estado de la base de datos
    app.get('/verify-db', async (req, res) => {
        try {
            const { verifyDataLoading } = await import('./seeders/load_all_data.js');
            await verifyDataLoading();
            
            res.json({
                mensaje: "Verificación de base de datos completada exitosamente"
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
// MIDDLEWARE DE MANEJO DE ERRORES
// =====================================================

// 404 - Ruta no encontrada
app.use('*', (req, res) => {
    res.status(404).json({
        status: 'error',
        endpoint: req.originalUrl,
        method: req.method,
        message: 'Route not found'
    });
});

// Middleware de manejo de errores global
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
// INICIAR SERVIDOR
// =====================================================

//Inicio del servidor cuando este todo listo
app.listen(3000, () => {
    console.log("servidor prepado correctamente en http://localhost:3000");
    console.log("📋 Endpoints disponibles:");
    console.log("   - GET/POST/PUT/DELETE  /plataformas");
    console.log("   - GET/POST/PUT/DELETE  /clientes");
    console.log("   - GET/POST/PUT/DELETE  /facturas");
    console.log("   - GET/POST/PUT/DELETE  /transacciones");
    console.log("   - GET  /clientes/:id/transacciones");
})

export default app;
