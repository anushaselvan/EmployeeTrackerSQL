const mysql2 = require('mysql2');
require('dotenv').config();

const mysql = new mysql2(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: 'localhost',
    database:'emptracker_db',
    user: 'root'
  }
);

module.exports = mysql;
