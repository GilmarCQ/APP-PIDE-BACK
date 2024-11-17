const express = require('express');
const pagina = require('../../controllers/menu/Pagina');
const paginaRouter = express.Router();

paginaRouter.get('/paginar', pagina.paginarPagina);

module.exports = {paginaRouter};
