const { Modulo } = require('../../config/Sequelize');
const {
    httpError500,
    httpOk200NoContent,
    httpOk200Content,
    httpCreated201,
    httpNotFound404,
    httpBadRequest400} = require('../../utils/httpMessages');


const paginarModulo = (req, res) => {
    const { order_by, sort_by, page, size } = req.query;
    console.log(req.query)
    Modulo.findAndCountAll({
        where: {},
        attributes: ['id', 'nombre', 'icono'],
        offset: page * size,
        limit: size,
        order: [ [ order_by] ]
    })
        .then(modulos => {
            // console.log(modulos)
            const data = getPagingData(modulos, page, size);
            return httpOk200Content(res, data, 'Consulta realizada correctamente.')
        })
        .catch(error => httpError500(res, error))
}
const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: lista } = data;
    const paginaActual = page ? +page : 0;
    const totalModulos = Math.ceil(totalItems / limit);
    return { totalItems, lista, totalModulos, paginaActual };
}

const crearModulo = (req, res) => {
    const {modulo} = req.body
    const moduloBuild = Modulo.build(modulo)
    moduloBuild.save()
        .then(moduloNuevo => httpCreated201(res, moduloNuevo, 'El módulo fue creado correctamente.'))
        .catch(error => httpError500(res, error))
}

module.exports = {
    paginarModulo, crearModulo
}
