// Services Web - Exercice 4 - Pokemon API
// S. Trottier - Cégep de Victoriaville

import * as controller from '../controllers/pokemons.controller.js';

// Nous avons besoin d'importer le module express pour utiliser la classe Router
import express from 'express';
// Nous créons un objet router qui va nous permettre de gérer les routes
const router = express.Router();

// Liste des pokemons avec pagination et filtrage par type (query parameters)
router.get('/liste', controller.getPokemons);

// Récupérer un pokemon en fonction de son id
// ATTENTION : la route doit être définie après les autres routes plus spécifiques (ex: /liste) 
//    pour éviter les conflits de routage
router.get('/:id', controller.getPokemonForId);

// Ajout d'un pokemon
router.post('/', controller.ajoutPokemon);

// Modification d'un pokemon
router.put('/:id', controller.modifiePokemon);

// Suppression d'un pokemon
router.delete('/:id', controller.supprimePokemon);


// IMPORTANT: On exporte le router pour pouvoir l'utiliser dans index.js
// Cet objet peut être utilisé comme un middleware
export default router;