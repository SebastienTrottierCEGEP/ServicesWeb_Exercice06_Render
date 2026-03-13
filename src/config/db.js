// Services Web - Ex 6
// Version du module mysql qu'on peut utiliser avec async/await
import mysql from "mysql2/promise";

import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
    connectionLimit: process.env.MYSQL_CONNECTION_LIMIT,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

export default pool;