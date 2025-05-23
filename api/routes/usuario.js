const express = require('express');
const router = express.Router();
const { poolConnect, pool, sql } = require('../db');

// Obtener todos los usuarios
router.get('/', async (req, res) => {
  await poolConnect;
  try {
    const result = await pool.request().query('SELECT * FROM usuario');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Crear nuevo usuario
router.post('/', async (req, res) => {
  const { nombre, tipo, correo, password } = req.body;
  await poolConnect;
  try {
    const result = await pool.request()
      .input('nombre', sql.NVarChar, nombre)
      .input('tipo', sql.NVarChar, tipo)
      .input('correo', sql.NVarChar, correo)
      .input('password', sql.NVarChar, password)
      .query('INSERT INTO usuario (nombre, tipo, correo, password) VALUES (@nombre, @tipo, @correo, @password)');
    res.status(201).send('Usuario creado');
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

// obtener un usuario por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  await poolConnect;
  try {
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM usuario WHERE id_usuario = @id');

      console.log(result);
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
