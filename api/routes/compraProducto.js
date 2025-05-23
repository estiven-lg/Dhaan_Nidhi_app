const express = require('express');
const router = express.Router();
const { poolConnect, pool, sql } = require('../db');

// Obtener todas las compras de productos
router.get('/', async (req, res) => {
  await poolConnect;
  try {
    const result = await pool.request().query('SELECT * FROM compra_producto');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Obtener todas las compras de producto de un usuario específico
router.get('/usuario/:id_usuario', async (req, res) => {
  const { id_usuario } = req.params;
  await poolConnect;
  try {
    const result = await pool.request()
      .input('id_usuario', sql.Int, id_usuario)
      .query(`
        SELECT cp.*, p.nombre AS nombre_producto, p.descripcion
        FROM compra_producto cp
        JOIN producto p ON cp.id_producto = p.id_producto
        WHERE cp.id_usuario = @id_usuario
        ORDER BY cp.fecha DESC
      `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});


// Crear una nueva compra de producto
router.post('/', async (req, res) => {
  const { id_usuario, id_producto, fecha, cantidad, puntos_usados } = req.body;
  await poolConnect;
  try {
    await pool.request()
      .input('id_usuario', sql.Int, id_usuario)
      .input('id_producto', sql.Int, id_producto)
      .input('fecha', sql.Date, fecha)
      .input('cantidad', sql.Int, cantidad)
      .input('puntos_usados', sql.Int, puntos_usados)
      .query(`
        INSERT INTO compra_producto (id_usuario, id_producto, fecha, cantidad, puntos_usados)
        VALUES (@id_usuario, @id_producto, @fecha, @cantidad, @puntos_usados)
      `);
    res.status(201).send('Compra de producto registrada');
  } catch (err) {
    console.error('Error al registrar compra de producto:', err);
    res.status(500).send(err.message);
  }
});

// Actualizar compra de producto
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { fecha, cantidad, puntos_usados } = req.body;
  await poolConnect;
  try {
    await pool.request()
      .input('id', sql.Int, id)
      .input('fecha', sql.Date, fecha)
      .input('cantidad', sql.Int, cantidad)
      .input('puntos_usados', sql.Int, puntos_usados)
      .query(`
        UPDATE compra_producto
        SET fecha = @fecha, cantidad = @cantidad, puntos_usados = @puntos_usados
        WHERE id_compra_prod = @id
      `);
    res.send('Compra de producto actualizada');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Eliminar compra de producto
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await poolConnect;
  try {
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM compra_producto WHERE id_compra_prod = @id');
    res.send('Compra de producto eliminada');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
