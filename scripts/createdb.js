var mysql = require('mysql');
var dbconfig = require('../config/db');

var connection = mysql.createConnection(dbconfig.connection);

connection.query('CREATE DATABASE IF NOT EXISTS ' + dbconfig.database)

connection.query('USE ' + dbconfig.database)

connection.query("\
CREATE TABLE IF NOT EXISTS `data` ( \
    `id` int(15) NOT NULL AUTO_INCREMENT, \
    `waktu` timestamp NULL DEFAULT current_timestamp(), \
    `tegangan` float DEFAULT NULL, \
    `arus` float DEFAULT NULL, \
    `daya` float DEFAULT NULL, \
    `spot` varchar(50) DEFAULT NULL, \
    PRIMARY KEY (`id`) \
  ) ENGINE=InnoDB AUTO_INCREMENT=171175 DEFAULT CHARSET=latin1; \
  \
  CREATE TABLE IF NOT EXISTS `spot` ( \
    `id` int(11) NOT NULL AUTO_INCREMENT, \
    `spot` varchar(50) DEFAULT NULL, \
    `token` varchar(50) DEFAULT NULL, \
    PRIMARY KEY (`id`) \
  ) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1; \
  \
  INSERT INTO `spot` (`id`, `spot`, `token`) VALUES \
      (1, 'Sensor 1', 'I6cm0M4wOTCEu5UzytkWlPYJgjSbA2RK'), \
      (2, 'Sensor 2', 'gKweuaeAmrHHaMMMpsAHY3nZpPhU5B9y'), \
      (3, 'Sensor 3', 'mwAdmFyyvXPUnXCJP5tBc69xAB7DgySz'); \
")

console.log('Success: Database Created!')

connection.end();