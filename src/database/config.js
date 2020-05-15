require("dotenv").config();

// Variables de entorno
const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const APP_NAME = process.env.APP_NAME;

// Almacén de pinturas
const config = {
  server: DB_HOST,
  port: 1433,
  user: DB_USER,
  password: DB_PASSWORD,
  database: "Alumayab3500v7",
  connectionTimeout: 150000,
  driver: "tedious",
  stream: "true",
  options: {
    appName: APP_NAME,
    encrypt: false,
    enableArithAbort: true,
  },
  pool: {
    max: 70,
    min: 0,
    idTimeoutMillis: 40000,
    log: true,
  },
};

module.exports = {
  config,
};
