const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');

const { conexion } = require('../config/Sequelize');
const { usuarioRouter } = require('../routes/Usuario');
const { reniecRouter } = require('../routes/pide/Reniec');
const { suneduRouter } = require('../routes/pide/Sunedu');
const { mineduRouter } = require('../routes/pide/Minedu');
const { sunarpRouter } = require('../routes/pide/Sunarp');
const { tipoDocumentoRouter } = require('../routes/catalogos/TipoDocumento');
const { asociacionRouter } = require('../routes/catalogos/Asociacion');
const { funcionarioRouter } = require('../routes/entidad/Funcionario');
const { areaRouter } = require('../routes/entidad/Area');
const { areaFuncionarioRouter } = require('../routes/entidad/AreaFuncionario');
const { visitaRouter } = require('../routes/transparencia/Visita');
const { paginaRouter } = require('../routes/menu/Pagina');
const { moduloRouter } = require('../routes/menu/Modulo');

class Server {
    constructor() {

        dotenv.config();
        this.app = express();
        this.app.use(cors());
        this.puerto = 5000;
        this.configurarParser();
        this.cargarRutas();
    }
    configurarParser() {
        this.app.use(bodyParser.json({limit: '50mb'}));
        this.app.use(express.urlencoded({limit: '50mb'}));
    }
    cargarRutas() {
        this.app.get('/', (req,res) =>
            res.status(200).send('La api esta funcionando correctamente'));
        this.app.use('/usuario', usuarioRouter);
        this.app.use('/Reniec', reniecRouter);
        this.app.use('/Sunedu', suneduRouter);
        this.app.use('/Minedu', mineduRouter);
        this.app.use('/Sunarp', sunarpRouter);
        this.app.use('/tipoDocumento', tipoDocumentoRouter);
        this.app.use('/asociacion', asociacionRouter);
        this.app.use('/funcionario', funcionarioRouter);
        this.app.use('/area', areaRouter);
        this.app.use('/cargoFuncionario', areaFuncionarioRouter);
        this.app.use('/visitas', visitaRouter);
        this.app.use('/pagina', paginaRouter);
        this.app.use('/modulo', moduloRouter);
    }
    start() {
        this.app.listen(this.puerto, () => console.log(`Todo operativo en el puerto ${this.puerto}`));
        conexion.sync({alter: false, force: false}).then(() => console.log('Base de datos sincronizada.', this.puerto))
    }
}
module.exports = Server;
