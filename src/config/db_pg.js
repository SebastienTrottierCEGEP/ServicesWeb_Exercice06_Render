// Services Web - Exercice 6
// node-postgres (pg) : https://node-postgres.com/
import pg from 'pg'
import dotenv from 'dotenv';
dotenv.config();

let params = { 
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT
}

// SSL est desactivé par default, mais on peut l'activer en mettant PG_SSL=true dans le .env
// Nécessaire pour se connecter à la BD sur render.com de l'extérieur
if (process.env.PG_SSL && process.env.PG_SSL.toLowerCase() === 'true') {
  params.ssl = { rejectUnauthorized: false };
}

const pool = new pg.Pool(params);

export default pool;