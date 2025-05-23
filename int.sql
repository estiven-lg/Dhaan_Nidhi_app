CREATE TABLE usuario (
    id_usuario INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(100) NOT NULL,
    tipo NVARCHAR(20) CHECK (tipo IN ('admin', 'agricultor')) NOT NULL,
    correo NVARCHAR(100),
    password  NVARCHAR(100) not null,
    puntos INT DEFAULT 0
);


-- Tabla: compra_rastrajo
CREATE TABLE compra_rastrajo (
    id_compra INT IDENTITY(1,1) PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_admin INT NOT NULL,
    fecha DATE NOT NULL,
    libras DECIMAL(10,2) NOT NULL,
    puntos_acreditados INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

-- Tabla: producto
CREATE TABLE producto (
    id_producto INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(100) NOT NULL,
    descripcion NVARCHAR(255),
    precio_puntos INT NOT NULL,
    stock INT NOT NULL
);

-- Tabla: compra_producto
CREATE TABLE compra_producto (
    id_compra_prod INT IDENTITY(1,1) PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_producto INT NOT NULL,
    fecha DATE NOT NULL,
    cantidad INT NOT NULL,
    puntos_usados INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto)
);

-- Tabla: movimiento_puntos
CREATE TABLE movimiento_puntos (
    id_movimiento INT IDENTITY(1,1) PRIMARY KEY,
    id_usuario INT NOT NULL,
    fecha DATE NOT NULL,
    tipo NVARCHAR(20) CHECK (tipo IN ('acreditacion', 'consumo')) NOT NULL,
    cantidad INT NOT NULL,
    descripcion NVARCHAR(255),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);


-- Trigger: registrar movimiento de puntos al acreditar por compra de rastrajo
CREATE TRIGGER trg_acreditar_puntos
ON compra_rastrajo
AFTER INSERT
AS
BEGIN
    INSERT INTO movimiento_puntos (id_usuario, fecha, tipo, cantidad, descripcion)
    SELECT id_usuario, fecha, 'acreditacion', puntos_acreditados, 
           CONCAT('Acreditación por ', libras, ' lb de rastrajo')
    FROM inserted;

    UPDATE usuario
    SET puntos = puntos + i.puntos_acreditados
    FROM usuario u
    JOIN inserted i ON u.id_usuario = i.id_usuario;
END;

-- Trigger: registrar movimiento de puntos al descontar por compra de producto
CREATE TRIGGER trg_consumo_puntos
ON compra_producto
AFTER INSERT
AS
BEGIN
    INSERT INTO movimiento_puntos (id_usuario, fecha, tipo, cantidad, descripcion)
    SELECT id_usuario, fecha, 'consumo', puntos_usados,
           CONCAT('Compra de producto ID: ', id_producto, ', cantidad: ', cantidad)
    FROM inserted;

    UPDATE usuario
    SET puntos = puntos - i.puntos_usados
    FROM usuario u
    JOIN inserted i ON u.id_usuario = i.id_usuario;
    
    UPDATE producto
    SET stock = stock - i.cantidad
    FROM producto p
    JOIN inserted i ON p.id_producto = i.id_producto
    WHERE p.stock >= i.cantidad;
END;



INSERT INTO usuario (nombre, tipo, correo, puntos,password) VALUES 
('Administrador Principal', 'admin', 'admin@agroempresa.com', 0, '1234'),
('Carlos Mendoza', 'agricultor', 'carlos.mendoza@example.com', 0, '1234'),
('Ana López', 'agricultor', 'ana.lopez@example.com', 0, '1234'),
('Pedro Ramírez', 'agricultor', 'pedro.ramirez@example.com', 0, '1234'),
('Luisa Fernández', 'agricultor', 'luisa.fernandez@example.com', 0, '1234'),
('Jorge Silva', 'agricultor', 'jorge.silva@example.com', 0, '1234'),
('Administrador Regional', 'admin', 'admin.regional@agroempresa.com', 0, '1234');


INSERT INTO producto (nombre, descripcion, precio_puntos, stock) VALUES 
('Semillas de maíz mejorado', 'Paquete de 2kg, variedad alta producción', 750, 150),
('Fertilizante NPK', 'Bolsa de 10kg, fórmula 15-15-15', 1200, 80),
('Herramienta de poda', 'Tijeras profesionales para poda', 950, 45),
('Sistema de riego básico', 'Kit para riego por goteo (50m)', 3500, 20),
('Insecticida orgánico', 'Botella de 1 litro, control de plagas', 600, 60),
('Manguera agrícola', 'Manguera de 20m, alta resistencia', 850, 30),
('Guantes de protección', 'Par de guantes para trabajo agrícola', 300, 100);

-- Para Carlos Mendoza
INSERT INTO compra_rastrajo (id_usuario, id_admin, fecha, libras, puntos_acreditados) 
VALUES (3, 1, '2023-01-15', 150.75, 1508);


-- Para Ana López
INSERT INTO compra_rastrajo (id_usuario, id_admin, fecha, libras, puntos_acreditados) 
VALUES (4, 1, '2023-01-18', 200.00, 2000);
INSERT INTO compra_rastrajo (id_usuario, id_admin, fecha, libras, puntos_acreditados) 
VALUES (4, 7, '2023-02-05', 180.50, 1805);


-- Para Pedro Ramírez
INSERT INTO compra_rastrajo (id_usuario, id_admin, fecha, libras, puntos_acreditados) 
VALUES (5, 7, '2023-02-10', 300.25, 3003);

