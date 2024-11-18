const axios = require('axios');
const {
    httpError500,
    httpOk200Content} = require('../../utils/httpMessages');
// const API_RENIEC = 'https://ws5.pide.gob.pe/Rest/Reniec';
const API_RENIEC = 'https://ws2.pide.gob.pe/Rest/RENIEC';

const consultaDni = (req, res) => {
    const { nuDniConsulta, nuDniUsuario, nuRucUsuario, password } = req.query;
    axios
        .post(`${API_RENIEC}/Consultar`,
        {
            params: {
                out: 'json'
            }, body: {
                PIDE: {
                    nuDniConsulta,
                    nuDniUsuario,
                    nuRucUsuario,
                    password,
                }
            },
        })
        .then(response => httpOk200Content(res, response.data, 'Consulta Realizada Correctamente.'))
        .catch(error => httpError500(res, error));
}

const actualizarCredencial = (req, res) => {
    const { credencialAnterior, credencialNueva, nuDni, nuRuc } = req.query;
    axios
        .get(`${API_RENIEC}/ActualizarCredencial`,
            { params: { credencialAnterior, credencialNueva, nuDni, nuRuc, out: 'json' } })
        .then(response => httpOk200Content(res, response.data, 'Actualización de credencial correcta.'))
        .catch(error => httpError500(res, error));
}
const renovarCredencial = (req, res) => {
    const { credencialAnterior, credencialNueva, nuDni, nuRuc } = req.query;
    axios
        .get(`${API_RENIEC}/ActualizarCredencial`,
            { params: { credencialAnterior, credencialNueva, nuDni, nuRuc, out: 'json' } })
        .then(response => httpOk200Content(res, response.data, 'Actualización de credencial correcta.'))
        .catch(error => httpError500(res, error));
}

module.exports = {
    consultaDni, actualizarCredencial, renovarCredencial
}