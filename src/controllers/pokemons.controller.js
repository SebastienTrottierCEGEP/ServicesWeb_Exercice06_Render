// Services Web - Exercice 6
// S. Trottier - Cégep de Victoriaville

import * as model from '../models/pokemons.model.js';

// Return: champs manquants (tableau de string) - vide si valide
// NOTE on pourrait aussi faire une validation plus poussée 
//  (ex: types de données, valeurs valides pour les types, etc.)
const validePokemonSoumis = (req) => {
    // L'intergiciel (middleware) express.json() a déjà parsé le JSON dans le corps de la requête 
    //  et créé un objet JavaScript req.body avec les données comme propriétés
    const { nom, type_primaire, type_secondaire, pv, attaque, defense } = req.body;
    let champsManquants = [];
    if (nom == null) champsManquants.push("nom");
    if (type_primaire == null) champsManquants.push("type_primaire");
    if (type_secondaire == null) champsManquants.push("type_secondaire");
    if (pv == null) champsManquants.push("pv");
    if (attaque == null) champsManquants.push("attaque");
    if (defense == null) champsManquants.push("defense");
    return champsManquants;
};

export const getPokemonForId = async (req, res) => {
     try {
        const pokemon = await model.getPokemonForId(req.params.id);
        if (!pokemon) {
            return res.status(404).json({"erreur": `Pokemon introuvable avec l'id ${req.params.id}`});
        }
        res.json(pokemon);
    } catch (erreur) {
        res.status(500).json({"erreur": `Erreur serveur ${erreur.message}`});
    }
}

export const getPokemons = async (req, res) => {
    try {
        if (req.query.type) {
            var pokemons = await model.getPokemonsPourType(req.query.page || 1, req.query.type);
            var numTotalPokemons = await model.getTotalPokemonsPourType(req.query.type);
        } else {
            var pokemons = await model.getPokemons(req.query.page || 1);
            var numTotalPokemons = await model.getTotalPokemons();
        }
 
        const resultats = {"pokemons": pokemons,
                           "type": req.query.type || "",
                           "nombrePokemonsTotal": numTotalPokemons,
                           "page": req.query.page || 1,
                           "totalPages": model.numPagesForTotalPokemons(numTotalPokemons)};   
        res.json(resultats);
    } catch (erreur) {
        res.status(500).json({"erreur": `Echec lors de la récupération de la liste des pokemons - ${erreur.message}`});
    }
};

export const ajoutPokemon = async (req, res) => {
    // Logique pour créer un produit

    // Validation de la présence des données requises
    let champsManquants = validePokemonSoumis(req);
    if(champsManquants.length > 0) { 
        return res.status(400).json({"erreur": 'Le format des données est invalide',
                                     "champs_manquants": champsManquants});
    }

    // L'intergiciel (middleware) express.json() a déjà parsé le JSON dans le corps de la requête 
    //  et créé un objet JavaScript req.body avec les données comme propriétés
    const { nom, type_primaire, type_secondaire, pv, attaque, defense } = req.body;

    try {
        const id = await model.ajoutPokemon(nom, type_primaire, type_secondaire, pv, attaque, defense);
        // On va chercher le pokemon tout juste créé dans la bd pour le retourner dans la réponse
        // (pas optimal car cela fait une requête supplémentaire à la db, mais c'est plus simple que de construire un objet pokemon 
        //   à partir des données d'entrée et de l'id généré)
        const pokemon = await model.getPokemonForId(id);
        res.status(201).json(pokemon);
    } catch (erreur) {
        res.status(500).json({"erreur": `Echec lors de la création du pokemon ${nom} - ${erreur.message}`});
    }
};

export const modifiePokemon = async (req, res) => {

    const id = req.params.id;

    // Validation de la présence des données requises
    let champsManquants = validePokemonSoumis(req);
    if(champsManquants.length > 0) { 
        return res.status(400).json({"erreur": 'Le format des données est invalide',
                                     "champs_manquants": champsManquants});
    }

    const { nom, type_primaire, type_secondaire, pv, attaque, defense } = req.body;
    
    try {
        const resultat = await model.modifiePokemon(id, nom, type_primaire, type_secondaire, pv, attaque, defense);
        if ( ! resultat) {
            return res.status(404).json({"erreur": `Le pokemon id ${id} n'existe pas dans la base de données`});
        }
        res.json({"message": `Le pokemon id ${id} a été modifié avec succès`});

    } catch (erreur) {
        res.status(500).json({"erreur": `Echec lors de la modification du pokemon ${nom} - ${erreur.message}`});
    }
};

export const supprimePokemon = async (req, res) => {
    const id = req.params.id;
    try {
        // TODO echo pokemon et 404
        const resultat = await model.supprimePokemon(id);
        if ( ! resultat) {
            return res.status(404).json({"erreur": `Le pokemonid ${id} n'existe pas dans la base de données`});
        }
        res.json({"message": `Le pokemon id ${id} a été supprimé avec succès`});
    } catch (erreur) {
        res.status(500).send('Erreur serveur');
    }
};