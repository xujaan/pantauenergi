const Sequelize = require("sequelize")
const db = {}
const Op = Sequelize.Op;
const conf = {
    'host': 'localhost',
    'user': 'root',
    'password': '1234569',
    'database': 'monitoring2'
}

const sequelize = new Sequelize(conf.database, conf.user, conf.password, {
    host: conf.host,
    dialect: "mysql",
    // operatorsAliases: false,
    // operatorsAliases: Op,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

db.sequelize = sequelize
db.Sequelize = Sequelize
db.conf = conf
module.exports = db