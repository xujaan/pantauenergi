const Sequelize = require("sequelize");
const db = require("../config/db.js");

module.exports = db.sequelize.define(
    "spot", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        spot: {
            type: Sequelize.STRING
        },
        token: {
            type: Sequelize.STRING
        }
    }, {
        timestamps: false,
        freezeTableName: true
    }
);