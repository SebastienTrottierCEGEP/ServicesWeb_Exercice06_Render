// ex06/index.js
// Services Web - Exercice 6
// S. Trottier - Cégep de Victoriaville

import dotenv from 'dotenv';
dotenv.config();

import express, { json } from 'express';

// Importation du module swagger-ui-express
import swaggerUi from 'swagger-ui-express';
// Le fichier qui contient la documentation au format JSON, ajustez selon votre projet
import fs from 'fs';
const swaggerDocument = JSON.parse(fs.readFileSync('./src/config/documentation.json', 'utf8'));

// Options le l'interface, changez le titre "Demo API" pour le nom de votre projet 
const swaggerOptions = {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "Demo API"
};

import pokemonRouter from './src/routes/pokemons.route.js';

const app = express();

// Middleware
app.use(express.json());

// Routes
// La route à utiliser pour accéder au rendu visuel de la documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));

app.use('/api/pokemons', pokemonRouter);

app.listen(process.env.PORT || 3000, () => {
    console.log(`Le serveur tourne sur le port ${process.env.PORT}`);
});