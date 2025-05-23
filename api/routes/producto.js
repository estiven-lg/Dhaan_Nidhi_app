const express = require('express');
const router = express.Router();
const sql = require('mssql');
const { pool, poolConnect } = require('../db');

// Crear producto
router.post('/', async (req, res) => {
  const { nombre, descripcion, precio_puntos, stock } = req.body;
  await poolConnect;
  try {
    const result = await pool.request()
      .input('nombre', sql.NVarChar, nombre)
      .input('descripcion', sql.NVarChar, descripcion)
      .input('precio_puntos', sql.Int, precio_puntos)
      .input('stock', sql.Int, stock)
      .query(`
        INSERT INTO producto (nombre, descripcion, precio_puntos, stock)
        OUTPUT INSERTED.*
        VALUES (@nombre, @descripcion, @precio_puntos, @stock)
      `);
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Obtener todos los productos
router.get('/', async (req, res) => {
  await poolConnect;
  try {
    const result = await pool.request()
      .query('SELECT * FROM producto');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Obtener un producto por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  await poolConnect;
  try {
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM producto WHERE id_producto = @id');
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Actualizar un producto
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio_puntos, stock } = req.body;
  await poolConnect;
  try {
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('nombre', sql.NVarChar, nombre)
      .input('descripcion', sql.NVarChar, descripcion)
      .input('precio_puntos', sql.Int, precio_puntos)
      .input('stock', sql.Int, stock)
      .query(`
        UPDATE producto
        SET nombre = @nombre, descripcion = @descripcion,
            precio_puntos = @precio_puntos, stock = @stock
        WHERE id_producto = @id;

        SELECT * FROM producto WHERE id_producto = @id;
      `);
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Eliminar un producto
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await poolConnect;
  try {
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query(`
        DELETE FROM producto WHERE id_producto = @id;
      `);
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
