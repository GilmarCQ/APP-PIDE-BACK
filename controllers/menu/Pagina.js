const { Pagina } = require('../../config/Sequelize');
const {
    httpError500,
    httpOk200NoContent,
    httpOk200Content,
    httpCreated201,
    httpNotFound404,
    httpBadRequest400} = require('../../utils/httpMessages');


const paginarPagina = (req, res) => {
    const { order_by, sort_by, page, size } = req.query;
    console.log(req.query)
    Pagina.findAndCountAll({
        where: {},
        attributes: ['id', 'nombre', 'url'],
        offset: page * size,
        limit: size,
        order: [ [sort_by, order_by] ]
    })
        .then(paginas => {
            console.log(paginas)
            const data = getPagingData(paginas, page, size);
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

module.exports = {
    paginarPagina
}
