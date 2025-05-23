const express = require('express');
const router = express.Router();
const sql = require('mssql');
const { pool, poolConnect } = require('../db');

// Endpoint de login
router.post('/login', async (req, res) => {
  const { correo , password } = req.body;

  if (!correo || !password) {
    return res.status(400).json({ message: 'Correo y nombre son requeridos.' });
  }

  await poolConnect;
  try {
    const result = await pool.request()
      .input('correo', sql.NVarChar, correo)
      .input('password', sql.NVarChar, password)
      .query(`
        SELECT *
        FROM usuario
        WHERE correo = @correo AND password = @password
      `);

    if (result.recordset.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const user = result.recordset[0];
    res.json({ message: 'Login exitoso', user });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
