# ExpertSoft - Financial Transaction Management System

A comprehensive financial transaction management system built with Node.js, Express.js, and MySQL. This system provides a complete CRUD API for managing clients, platforms, invoices, and transactions with proper data normalization and relational database design.

## 👨‍💻 Author Information

- **Name:** Luis Orozco
- **Email:** luisoro009@gmail.com
- **Clan:** Cienaga
- **ID:** 1130266331

## 🚀 Features

- **Complete CRUD Operations** for all entities
- **Data Normalization** with proper relational database design
- **RESTful API** following best practices
- **MySQL Database** with foreign key constraints
- **Error Handling** with consistent response format
- **Data Seeding** scripts for initial data population

## 🛠️ Tech Stack

- **Backend:** Node.js + Express.js
- **Database:** MySQL
- **Database Driver:** mysql2
- **CORS:** Enabled for frontend integration
- **Data Processing:** CSV parsing and database seeding

## 📋 Prerequisites

- Node.js (v16 or higher)
- MySQL Server (v8.0 or higher)
- npm or yarn package manager

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ExpertSoft
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Database Setup**
   - Create a MySQL database
   - Import the database schema from `docs/base_de_datos.sql`
   - Configure database connection in `server/conexion_db.js`

4. **Environment Variables**
   ```bash
   # Create .env file (optional)
   NODE_ENV=development
   PORT=3000
   ```

5. **Seed the Database**
   ```bash
   npm run seed
   ```

6. **Start the Server**
   ```bash
   npm run server
   # or for development with auto-reload
   npm run server:dev
   ```

## 📊 Database Schema

The system uses a normalized database design with the following entities:

- **plataformas** (Platforms): Financial platforms like Nequi, Daviplata
- **clientes** (Clients): Customer information and details
- **facturas** (Invoices): Billing and payment records
- **transacciones** (Transactions): Financial transactions with relationships

## 🔌 API Endpoints

### Platforms (`/plataformas`)

#### GET `/plataformas`
Retrieve all platforms
```bash
curl http://localhost:3000/plataformas
```

#### GET `/plataformas/:id`
Retrieve a specific platform by ID
```bash
curl http://localhost:3000/plataformas/1
```

#### POST `/plataformas`
Create a new platform
```bash
curl -X POST http://localhost:3000/plataformas \
  -H "Content-Type: application/json" \
  -d '{
    "nombre_plataforma": "Bancolombia"
  }'
```

#### PUT `/plataformas/:id`
Update an existing platform
```bash
curl -X PUT http://localhost:3000/plataformas/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nombre_plataforma": "Bancolombia Actualizado"
  }'
```

#### DELETE `/plataformas/:id`
Delete a platform
```bash
curl -X DELETE http://localhost:3000/plataformas/1
```

### Clients (`/clientes`)

#### GET `/clientes`
Retrieve all clients
```bash
curl http://localhost:3000/clientes
```

#### GET `/clientes/:id`
Retrieve a specific client by ID
```bash
curl http://localhost:3000/clientes/1
```

#### GET `/clientes/:id/transacciones`
Retrieve all transactions for a specific client
```bash
curl http://localhost:3000/clientes/1/transacciones
```

#### POST `/clientes`
Create a new client
```bash
curl -X POST http://localhost:3000/clientes \
  -H "Content-Type: application/json" \
  -d '{
    "nombre_cliente": "Juan Pérez",
    "numero_identificacion": "12345678",
    "direccion": "Calle 123 #45-67",
    "telefono": "3001234567",
    "correo_electronico": "juan.perez@email.com"
  }'
```

#### PUT `/clientes/:id`
Update an existing client
```bash
curl -X PUT http://localhost:3000/clientes/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nombre_cliente": "Juan Pérez Actualizado",
    "numero_identificacion": "12345678",
    "direccion": "Calle 123 #45-67",
    "telefono": "3001234567",
    "correo_electronico": "juan.perez.actualizado@email.com"
  }'
```

#### DELETE `/clientes/:id`
Delete a client
```bash
curl -X DELETE http://localhost:3000/clientes/1
```

### Invoices (`/facturas`)

#### GET `/facturas`
Retrieve all invoices
```bash
curl http://localhost:3000/facturas
```

#### GET `/facturas/:id`
Retrieve a specific invoice by ID
```bash
curl http://localhost:3000/facturas/1
```

#### POST `/facturas`
Create a new invoice
```bash
curl -X POST http://localhost:3000/facturas \
  -H "Content-Type: application/json" \
  -d '{
    "numero_factura": "FAC-001-2024",
    "periodo_facturacion": "2024-01",
    "monto_facturado": 150000.00,
    "monto_pagado": 0.00
  }'
```

#### PUT `/facturas/:id`
Update an existing invoice
```bash
curl -X PUT http://localhost:3000/facturas/1 \
  -H "Content-Type: application/json" \
  -d '{
    "numero_factura": "FAC-001-2024",
    "periodo_facturacion": "2024-01",
    "monto_facturado": 150000.00,
    "monto_pagado": 150000.00
  }'
```

#### DELETE `/facturas/:id`
Delete an invoice
```bash
curl -X DELETE http://localhost:3000/facturas/1
```

### Transactions (`/transacciones`)

#### GET `/transacciones`
Retrieve all transactions with related data
```bash
curl http://localhost:3000/transacciones
```

#### GET `/transacciones/:id`
Retrieve a specific transaction by ID
```bash
curl http://localhost:3000/transacciones/TXN001
```

#### POST `/transacciones`
Create a new transaction
```bash
curl -X POST http://localhost:3000/transacciones \
  -H "Content-Type: application/json" \
  -d '{
    "id_transaccion": "TXN001",
    "id_cliente": 1,
    "id_plataforma": 1,
    "id_factura": 1,
    "fecha_hora_transaccion": "2024-01-15 10:30:00",
    "monto_transaccion": 150000.00,
    "estado_transaccion": "Completada",
    "tipo_transaccion": "Pago de factura"
  }'
```

#### PUT `/transacciones/:id`
Update an existing transaction
```bash
curl -X PUT http://localhost:3000/transacciones/TXN001 \
  -H "Content-Type: application/json" \
  -d '{
    "id_cliente": 1,
    "id_plataforma": 1,
    "id_factura": 1,
    "fecha_hora_transaccion": "2024-01-15 10:30:00",
    "monto_transaccion": 150000.00,
    "estado_transaccion": "Completada",
    "tipo_transaccion": "Pago de factura actualizado"
  }'
```

#### DELETE `/transacciones/:id`
Delete a transaction
```bash
curl -X DELETE http://localhost:3000/transacciones/TXN001
```

## 🔧 Development Endpoints

### Initialize Database
```bash
curl -X POST http://localhost:3000/init-db
```

### Verify Database Status
```bash
curl http://localhost:3000/verify-db
```

## 📝 Response Format

### Success Response
```json
{
  "mensaje": "Operation completed successfully"
}
```

### Error Response
```json
{
  "status": "error",
  "endpoint": "/api/endpoint",
  "method": "POST",
  "message": "Error description"
}
```

## 🗄️ Database Relationships

The system maintains referential integrity through foreign keys:

- **transacciones.id_cliente** → **clientes.id_cliente**
- **transacciones.id_plataforma** → **plataformas.id_plataforma**
- **transacciones.id_factura** → **facturas.id_factura**

## 📁 Project Structure

```
ExpertSoft/
├── app/                    # Frontend assets
├── docs/                   # Documentation and database schema
├── server/                 # Backend server
│   ├── conexion_db.js     # Database connection
│   ├── index.js           # Main Express server
│   ├── seeders/           # Database seeding scripts
│   └── data/              # Data files (CSV, Excel)
├── package.json            # Project dependencies
└── README.md              # This file
```

## 🚀 Available Scripts

```bash
# Start the server
npm run server

# Start the server in development mode
npm run server:dev

# Run database seeders
npm run seed
```

## 🔒 Security Considerations

- Input validation and sanitization
- SQL injection prevention through parameterized queries
- CORS configuration for frontend integration
- Error handling without exposing sensitive information

## 🧪 Testing the API

You can test the API using:

- **cURL** commands (examples provided above)
- **Postman** or similar API testing tools
- **Frontend applications** that consume the API

## 📊 Data Flow Example

1. **Create a client** → POST `/clientes`
2. **Create an invoice** → POST `/facturas`
3. **Create a transaction** → POST `/transacciones`
4. **Retrieve client transactions** → GET `/clientes/:id/transacciones`

## 🤝 Contributing

This project is maintained by Luis Orozco. For questions or contributions, please contact:

- **Email:** luisoro009@gmail.com
- **Clan:** Cienaga
- **ID:** 1130266331

## 📄 License

This project is proprietary software developed by Luis Orozco.

## 🔄 Version History

- **v1.0.0** - Initial release with complete CRUD operations
- Complete data normalization and relational database design
- Express.js API with comprehensive error handling
- Database seeding and verification capabilities

---

**Created by Luis Orozco (Cienaga Clan)**
