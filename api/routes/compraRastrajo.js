const express = require('express');
const router = express.Router();
const { poolConnect, pool, sql } = require('../db');

// Obtener todas las compras de rastrajo
router.get('/', async (req, res) => {
  await poolConnect;
  try {
    const result = await pool.request().query('SELECT * FROM compra_rastrajo');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Crear una nueva compra de rastrajo
router.post('/', async (req, res) => {
  const { id_usuario, fecha, libras, puntos_acreditados } = req.body;
  await poolConnect;
  try {
    await pool.request()
      .input('id_usuario', sql.Int, id_usuario)
      .input('fecha', sql.Date, fecha)
      .input('libras', sql.Decimal(10, 2), libras)
      .input('puntos_acreditados', sql.Int, puntos_acreditados)
      .query(`
        INSERT INTO compra_rastrajo (id_usuario, fecha, libras, puntos_acreditados)
        VALUES (@id_usuario, @fecha, @libras, @puntos_acreditados)
      `);
    res.status(201).send('Compra de rastrajo registrada');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Actualizar compra de rastrajo
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { fecha, libras, puntos_acreditados } = req.body;
  await poolConnect;
  try {
    await pool.request()
      .input('id', sql.Int, id)
      .input('fecha', sql.Date, fecha)
      .input('libras', sql.Decimal(10, 2), libras)
      .input('puntos_acreditados', sql.Int, puntos_acreditados)
      .query(`
        UPDATE compra_rastrajo
        SET fecha = @fecha, libras = @libras, puntos_acreditados = @puntos_acreditados
        WHERE id_compra = @id
      `);
    res.send('Compra de rastrajo actualizada');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Eliminar compra de rastrajo
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await poolConnect;
  try {
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM compra_rastrajo WHERE id_compra = @id');
    res.send('Compra de rastrajo eliminada');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
