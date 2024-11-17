const express = require('express');
const modulo = require('../../controllers/menu/Modulo');
const moduloRouter = express.Router();

moduloRouter.get('/paginar', modulo.paginarModulo);
moduloRouter.post('/agregar', modulo.crearModulo);

module.exports = {moduloRouter};
