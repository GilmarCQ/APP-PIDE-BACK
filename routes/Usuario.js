const usuario = require('../controllers/Usuario');
const express = require('express');
const usuarioRouter = express.Router();

usuarioRouter.post('/crear',  usuario.createUser);
usuarioRouter.put('/editar-nombre-usuario', usuario.tokenIsValid, usuario.editUserName);
usuarioRouter.put('/editar-password', usuario.updatePassword);
usuarioRouter.put('/editar', usuario.editUser);
usuarioRouter.post('/cambiar-estado', usuario.cambiarEstadoUser);
usuarioRouter.get('/paginar', usuario.paginarUsuarios);
usuarioRouter.post('/reset', usuario.resetPassword);
usuarioRouter.post('/login', usuario.login);
usuarioRouter.get('/token-valid', usuario.tokenIsValid);

module.exports = {usuarioRouter};
