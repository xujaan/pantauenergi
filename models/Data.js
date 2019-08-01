const Sequelize = require("sequelize");
const db = require("../config/db.js");

module.exports = db.sequelize.define(
    "data", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        waktu: {
            type: 'TIMESTAMP',
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false
        },
        tegangan: {
            type: Sequelize.FLOAT
        },
        arus: {
            type: Sequelize.FLOAT
        },
        daya: {
            type: Sequelize.FLOAT
        },
        spot: {
            type: Sequelize.STRING
        }
    }, {
        timestamps: false,
        freezeTableName: true
    }
);