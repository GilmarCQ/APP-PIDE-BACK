const Sequelize = require('sequelize');

const entidadModel = require('../models/entidad/Entidad');
const sedeModel = require('../models/entidad/Sede');
const areaModel = require('../models/entidad/Area');
const areaJerarquia = require('../models/entidad/AreaJerarquia');
const funcionarioModel = require('../models/entidad/Funcionario');
const areaFuncionarioModel = require('../models/entidad/AreaFuncionario');

const usuarioModel = require('../models/Usuario');
const paginaModel = require('../models/Pagina');
const moduloModel = require('../models/Modulo');
const usuarioModuloModel = require('../models/usuarioModulo');
const tipoDocumentoModel = require('../models/catalogos/TipoDocumento');
const asociacionModel = require('../models/catalogos/Asociacion');
const personaModel = require('../models/Persona');
const visitaModel = require('../models/visitas/Visita');
const visitanteModel = require('../models/visitas/Visitante');


const conexion = new Sequelize(
    'municipio', 'postgres', 'postgres',
    {
        host: 'localhost',
        dialect: 'postgres',
        port: 5432
    }
);
// const conexion = new Sequelize(
//     'municipiopruebas', 'mdy', 'qazWSX123456', {
//         host: '192.168.1.3',
//         dialect: 'postgres',
//         port: 5432
//     }
// );
// const conexion = new Sequelize(
//     'municipio', 'postgres', 'qazWSX123456', {
//         host: '192.168.1.252',
//         dialect: 'postgres',
//         port: 5432
//     }
// );

const Entidad = entidadModel(conexion);
const Sede = sedeModel(conexion);
const Area = areaModel(conexion);
const Funcionario = funcionarioModel(conexion);
const AreaFuncionario = areaFuncionarioModel(conexion);
const AreaJerarquia = areaJerarquia(conexion);

const Usuario = usuarioModel(conexion);
const Pagina = paginaModel(conexion);
const Modulo = moduloModel(conexion);
const UsuarioModulo = usuarioModuloModel(conexion);
const TipoDocumento = tipoDocumentoModel(conexion);
const Asociacion = asociacionModel(conexion);
const Persona = personaModel(conexion);
const Visita = visitaModel(conexion);
const Visitante = visitanteModel(conexion);

// Definicion de Relaciones entre tablas
// Pagina.belongsTo(Modulo);
// Modulo.hasMany(Pagina);
Usuario.belongsToMany(Modulo, {through: UsuarioModulo});
Modulo.belongsToMany(Usuario, {through: UsuarioModulo});
Entidad.hasMany(Sede);
Visita.belongsTo(Visitante);
Visitante.hasOne(Visita);
Visita.belongsTo(Sede);
Visita.belongsTo(AreaFuncionario);
Visitante.belongsTo(Persona);
Persona.hasOne(Visitante);
Funcionario.belongsTo(Persona, { foreignKey: 'personaId' });
Area.belongsToMany(Funcionario, { through: AreaFuncionario, foreignKey: 'areaId'});
Funcionario.belongsToMany(Area, { through: AreaFuncionario, foreignKey: 'funcionarioId'});
Funcionario.hasMany(AreaFuncionario);
AreaFuncionario.belongsTo(Funcionario);
Area.hasMany(AreaFuncionario);
AreaFuncionario.belongsTo(Area);
Area.hasOne(AreaJerarquia, { foreignKey: 'areaBaseId' });
Area.hasOne(AreaJerarquia, { foreignKey: 'areaSuperiorId' });


module.exports = {
    conexion, Usuario, Pagina, Modulo, UsuarioModulo, TipoDocumento, Asociacion, Persona,
    Area, Funcionario, AreaFuncionario, AreaJerarquia, Visita, Visitante
}
