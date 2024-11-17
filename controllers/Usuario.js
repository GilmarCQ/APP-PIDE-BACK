const { Usuario } = require('../config/Sequelize');
const jwt = require('jsonwebtoken');
const {
    httpError500,
    httpOk200NoContent,
    httpOk200Content,
    httpCreated201,
    httpNotFound404,
    httpBadRequest400} = require('../utils/httpMessages');

const login = async (req, res) => {
    try {
        const user = req.body;
        const userFinded = await findUserByUserName(user.usuario, res);
        if (userFinded) {
            if (userFinded.estado == 'I') {
                return httpNotFound404(res, 'Usuario esta inactivo.');
            }
            if (await (userFinded.validarPassword(user.password))) {
                let token = await userFinded.generarJWT();
                    return httpOk200Content(res,
                        {
                            "nombres": userFinded.nombres,
                            "apellidos": userFinded.apellidos,
                            "usuario": userFinded.usuario,
                            "usu_reniec": userFinded.usu_reniec,
                            "usu_pass": userFinded.pass_reniec,
                            "tipo": userFinded.tipo,
                            "token": token
                        }, 'Usuario logueado correctamente.')
            }
        }
        return httpNotFound404(res, 'Usuario o contraseña no encontrado.')
    } catch (error) {
        return httpError500(res, error)
    }
}

const tokenIsValid = (req, res, next) => {
    const {authorization} = req.headers;
    if (authorization) {
        jwt.verify(authorization, 'q@zWSX123456', { algorithm: 'RS256' },
            (err, user) => {
                if (err) {
                    return httpBadRequest400(res, 'El token de sesión es inválido, vuelva a iniciar sesión.');
                }
                next();
            });
    } else {
        return httpBadRequest400(res, 'El token de sesión es inválido, vuelva a iniciar sesión.');
    }
}

/**
 * Método que permite la creación de un usuario, valida que no exista otro usuario con el mismo nombre de usuario
 * @param req
 * @param res
 */
const createUser = async (req, res) => {
    const {user} = req.body;
    user.password = user.usuario
    if (await isDuplicateUser(user.usuario, res))
        httpBadRequest400(res, 'El usuario ya existe, ingrese otro nombre de usuario.');
    const userBuild = Usuario.build(user);
    userBuild.setSaltAndHash(user.password);
    userBuild.save()
        .then(newUser => httpCreated201(res, newUser, 'El usuario fue creado correctamente.'))
        .catch(error => httpError500(res, error))
}

const editUser = async (req, res) => {
    const {user} = req.body;
    Usuario.findOne({where: {id: user.id}})
        .then(userFind => {
            if (userFind) {
                userFind.telefono = user.telefono
                userFind.email = user.email
                userFind.tipo = user.tipo
                userFind.usu_reniec = user.usu_reniec
                userFind.usu_pass = user.usu_pass
                userFind.save()
                    .then((userUpdated) => {
                        return httpOk200NoContent(res, `Usuario ${user.usuario} actualizado correctamente.`)
                    })
            } else {
                return httpNotFound404(res, 'No se encontro el usuario para su edición.')
            }
        })
        .catch(error => httpError500(req, error))
}

const updatePassword = (req, res) => {
    const user = req.body;
    Usuario.findOne({where: { id: user.id, usuario: user.usuario}})
        .then(userFind => {
            if (userFind) {
                if (userFind.validarPassword(user.password)) {
                    userFind.setSaltAndHash(user.passwordNuevo);
                    userFind.save()
                        .then(userUpdate =>
                            httpOk200NoContent(res, 'La contraseña del usuario fue actualizada correctamente.'))
                        .catch(error => httpError500(res, error))
                } else {
                    httpNotFound404(res, 'El usuario o password ingresados son incorrectos.')
                }
            } else {
                httpNotFound404(res, 'El usuario o password ingresados son incorrectos.')
            }
        })
        .catch(error => httpError500(res, error))
}

const resetPassword = (req, res) => {
    const user = req.body;
    Usuario.findOne({ where: { usuario: user.usuario } })
        .then(userFind => {
            if (userFind) {
                userFind.setSaltAndHash(user.usuario)
                userFind.save()
                    .then(userUpdate => httpOk200NoContent(res, 'La contraseña del usuario se restablecio correctamente.'))
                    .catch(error => httpError500(res, error))
            } else {
                httpNotFound404(400, 'El usuario a restablecer contraseña es incorrecto.')
            }
        })
        .catch(error => httpError500(req, error))
}


/**
 * Método que actualiza el nombre de usuario, valida que no se duplique el nombre de usuario
 * @param req
 * @param res
 */
const editUserName = async (req, res) => {
    try {
        const user = req.body;
        var userFind = await findUserById(user.id, res);
        if (userFind) {
            const userFindName = await findUserByUserName(user.usuario, res);
            if (userFindName) {
                if (userFind.id === userFindName.id) {
                    userFind.usuario = user.usuario;
                    userFind.save()
                        .then(userUpdate => httpOk200NoContent(res, 'Usuario actualizado correctamente.'))
                        .catch(error => httpError500(res, error))
                } else {
                    httpBadRequest400(res, 'El usuario ya existe, ingrese otro nombre de usuario.')
                }
            } else {
                userFind.usuario = user.usuario;
                userFind.save()
                    .then(userUpdate => httpOk200NoContent(res, 'Usuario actualizado correctamente.'))
                    .catch(error => httpError500(res, error))
            }
        } else {
            httpNotFound404(res,'El usuario a editar no fue encontrado.')
        }
    } catch (error) {
        httpError500(res, error);
    }

}

const cambiarEstadoUser = (req, res) => {
    const { id } = req.body;
    Usuario.findOne({where: {id}})
        .then(async userFind => {
            if (userFind) {
                let estado = (userFind.estado == 'A') ? 'I' : 'A'
                await userFind.update({ estado }, { where: { id } })
                return httpOk200NoContent(res, 'Estado del usuario actualizado correctamente.')
            }
            return httpNotFound404(res, 'El usuario no fue encontrado.');
        })
        .catch(error => httpError500(res, error))
}

const paginarUsuarios = (req, res) => {
    const { order_by, sort_by, page, size } = req.query;
    console.log(req.query)
    Usuario.findAndCountAll({
        where: {},
        attributes: ['id', 'email', 'telefono', 'tipo', 'usu_reniec', 'usuario','estado', 'pass_reniec'],
        offset: page * size,
        limit: size,
        order: [ ['estado'], [sort_by, order_by] ]
        })
        .then(users => {
            const data = getPagingData(users, page, size);
            return httpOk200Content(res, data, 'Consulta realizada correctamente.')
        })
        .catch(error => httpError500(res, error))
}

const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: lista } = data;
    const paginaActual = page ? +page : 0;
    const totalPaginas = Math.ceil(totalItems / limit);
    return { totalItems, lista, totalPaginas, paginaActual };
}

/**
 * Método que valida if el usuario a nombre de usuario a buscar es duplicado
 * @param usuario
 * @param res
 * @returns {Promise<boolean|void>} : true => duplicado; false => no duplicado
 */
const isDuplicateUser = async (usuario, res) => {
    return await
        Usuario.findOne({where: {usuario}})
            .then(user => !!user)
            .catch(error => httpError500(res, error))
}

/**
 * Método que busca un usuario a partir del id del usuario
 * @param usuario
 * @param res
 * @returns {Promise<T|void>} : T=> usuario; null
 */
const findUserById = async (id, res) => {
    try {
        return await Usuario.findOne({where: {id}})
            .then(user => user)
            .catch(error => httpError500(res, error));
    } catch (error) {
        httpError500(res, error);
    }
}

/**
 * Método que busca un usuario a partir del nombre del usuario
 * @param usuario
 * @param res
 * @returns {Promise<T|void>} : T=> usuario; null
 */
const findUserByUserName = async (usuario, res) => {
    try {
        return await Usuario.findOne({where: {usuario}})
            .then(user => user)
            .catch(error => httpError500(res, error));
    } catch (error) {
        httpError500(res, error);
    }
}

module.exports = {
    createUser,
    editUserName,
    cambiarEstadoUser,
    updatePassword,
    paginarUsuarios,
    login,
    tokenIsValid,
    resetPassword,
    editUser
}