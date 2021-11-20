const Mysql2 = require('mysql2');
require("dotenv").config();


const mysql2 = Mysql2.createConnection({
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

module.exports = mysql2;
