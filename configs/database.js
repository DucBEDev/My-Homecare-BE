const sql = require('mssql');

// Default config
const defaultConfig = {
    user: process.env.DB_USER_NAME,
    password: process.env.DB_PASS,
    server: process.env.HOST,
    port: parseInt(process.env.DB_PORT),
    database: process.env.DB_NAME,
    options: {
        encrypt: false, // true for Azure, false for local dev
        trustServerCertificate: true, // required for self-signed certs
        enableArithAbort: true
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
}

const poolPromise = new sql.ConnectionPool(defaultConfig)
    .connect()
    .then(pool => {
        console.log("Connected to SQL Server successfully");
        return pool;
    })
    .catch(err => {
        console.log("Error connecting to SQL Server", err);
        throw err;
    })

module.exports = {
    sql, poolPromise
}

