CREATE DATABASE IF NOT EXISTS ExpertSoft;
USE ExpertSoft;

CREATE TABLE plataformas (
    id_plataforma INT AUTO_INCREMENT PRIMARY KEY,
    nombre_plataforma VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE clientes (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nombre_cliente VARCHAR(100) NOT NULL,
    numero_identificacion BIGINT NOT NULL UNIQUE,
    direccion TEXT NOT NULL,
    telefono VARCHAR(50) NOT NULL,
    correo_electronico VARCHAR(100) NOT NULL
);

CREATE TABLE facturas (
    id_factura INT AUTO_INCREMENT PRIMARY KEY,
    numero_factura VARCHAR(20) NOT NULL UNIQUE,
    periodo_facturacion VARCHAR(7) NOT NULL,
    monto_facturado DECIMAL(15,2) NOT NULL,
    monto_pagado DECIMAL(15,2) NOT NULL DEFAULT 0.00
);

CREATE TABLE transacciones (
    id_transaccion VARCHAR(20) PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_plataforma INT NOT NULL,
    id_factura INT NOT NULL,
    fecha_hora_transaccion DATETIME NOT NULL,
    monto_transaccion DECIMAL(15,2) NOT NULL,
    estado_transaccion ENUM('Pendiente', 'Completada', 'Fallida', 'Cancelada') NOT NULL DEFAULT 'Pendiente',
    tipo_transaccion VARCHAR(50) NOT NULL,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente),
    FOREIGN KEY (id_plataforma) REFERENCES plataformas(id_plataforma),
    FOREIGN KEY (id_factura) REFERENCES facturas(id_factura)
);