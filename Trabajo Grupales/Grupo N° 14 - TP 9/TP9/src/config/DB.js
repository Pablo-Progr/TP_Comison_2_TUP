// config/DB.js

//Se cambio a Prisma como ORM para la gestión de la base de datos

/*const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "club_deportivo_tp",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Export default (callback-based)
module.exports = pool;

// Export helper para promesas
const promisePool = pool.promise();
module.exports.promise = () => promisePool;*/
