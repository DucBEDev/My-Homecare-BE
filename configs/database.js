const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4', 
});

pool.getConnection()
    .then(conn => {
        console.log('Connected to Railway MySQL!');
        conn.release();
    })
    .catch(err => {
        console.error('Connection failed:', err.message);
});

  
module.exports = pool;