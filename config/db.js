const Sequelize = require("sequelize");
const db = {};
const Op = Sequelize.Op;
const sequelize = new Sequelize("monitoring", "root", "1234569", {
    host: "localhost",
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

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;