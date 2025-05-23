const express = require('express');
const app = express();

const usuarioRoutes = require('./routes/usuario');
const compraRastrajoRoutes = require('./routes/compraRastrajo');
const compraProductoRoutes = require('./routes/compraProducto');
const authRoutes = require('./routes/auth');
const productoRoutes = require('./routes/producto');


app.use(express.json());

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/compra_rastrajo', compraRastrajoRoutes);
app.use('/api/compra_producto', compraProductoRoutes);
app.use('/api', authRoutes);
app.use('/api/producto', productoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
