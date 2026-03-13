// Services Web - Exercice 6
// S. Trottier - Cégep de Victoriaville
import pool from "../config/db_pg.js"; // PostgreSQL

// params: 
//  id: number
export async function getPokemonForId(id) {

    const requete = `SELECT id,
                            nom,
                            type_primaire,
                            type_secondaire,
                            pv,
                            attaque,
                            defense 
                    FROM public.pokemon
                    WHERE id = $1;`;
    const parametres = [id];
    try {
        // .query() en PostgreSQL
        const resultats = await pool.query(requete, parametres);
        return resultats.rows[0] || null; // Retourne le premier résultat ou null si aucun résultat
    } catch (erreur) {
        console.error(`Erreur getPokemonForId(): ${erreur}`);
        throw erreur;
    }
};

//////////////////////////////////////////////////
// Requetes avec pagination

const POKEMONS_PAR_PAGE = 25;

// returns: int
export function numPagesForTotalPokemons(nombreTotalPokemons) {
    return Math.ceil(nombreTotalPokemons / POKEMONS_PAR_PAGE);
}

// params:
//  page: number
export async function getPokemons(page) {

    const offset = (page - 1) * POKEMONS_PAR_PAGE;
    const requete = `SELECT id,
                            nom,
                            type_primaire,
                            type_secondaire,
                            pv,
                            attaque,
                            defense 
                    FROM public.pokemon
                    LIMIT $1
                    OFFSET $2`;
    const parametres = [POKEMONS_PAR_PAGE, offset];
    try {
        const resultats = await pool.query(requete, parametres);
        return resultats.rows;
    } catch (erreur) {
        console.error(`Erreur getPokemons(): ${erreur}`);
        throw erreur;
    }
};

// returns: int
export async function getTotalPokemons() {
    try {
        const resultats = await pool.query(`SELECT COUNT(*) as total FROM public.pokemon;`);
        return resultats.rows[0].total;
    } catch (erreur) {
        console.error(`Erreur getTotalPokemons(): ${erreur}`);
        throw erreur;
    }
};

// params:
//  page: number
//  type: string
export async function getPokemonsPourType(page, type) {

    const offset = (page - 1) * POKEMONS_PAR_PAGE;
    let requete = `SELECT id,
                          nom,
                          type_primaire,
                          type_secondaire,
                          pv,
                          attaque,
                          defense 
                    FROM public.pokemon 
                    WHERE type_primaire = $1 LIMIT $2 OFFSET $3`;
    const parametres = [type, POKEMONS_PAR_PAGE, offset];
    try {
        const resultats = await pool.query(requete, parametres);
        return resultats.rows;
    } catch (erreur) {
        console.error(`Erreur getPokemons(): ${erreur}`);
        throw erreur;
    }
};

// returns: int
export async function getTotalPokemonsPourType(type) {
    try {
        const resultats = await pool.query(`SELECT COUNT(*) as total FROM public.pokemon WHERE type_primaire = $1;`, [type]);
        return resultats.rows[0].total;
    } catch (erreur) {
        console.error(`Erreur getTotalPokemonsPourType(): ${erreur}`);
        throw erreur;
    }
};

// returns: id pokemon créé
export async function ajoutPokemon(nom, type_primaire, type_secondaire, pv, attaque, defense) {
    // Ajoute un nouveau pokemon à la liste
    // console.log(`Ajout du pokemon : nom=${nom}, type_primaire=${type_primaire}, type_secondaire=${type_secondaire}, pv=${pv}, attaque=${attaque}, defense=${defense}`);
    const requete = `INSERT INTO public.pokemon (nom, type_primaire, type_secondaire, pv, attaque, defense) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;`;
    const valeurs = [nom, type_primaire, type_secondaire, pv, attaque, defense];
    try {
        const resultats = await pool.query(requete, valeurs);
        // console.log(`Pokemon ajouté avec succès, ID: ${resultat.insertId}`);
        return resultats.rows[0].id;
    } catch (erreur) {
        console.error(`Erreur ajoutPokemon(): ${erreur}`);
        throw erreur;
    }
};

// returns: pokemon modifié ou null si id non trouvé
export async function modifiePokemon(id, nom, type_primaire, type_secondaire, pv, attaque, defense) {

    const requete = `UPDATE public.pokemon SET nom = $1, 
                                        type_primaire = $2,
                                        type_secondaire = $3, 
                                        pv = $4,
                                        attaque = $5,
                                        defense = $6 
                    WHERE id = $7
                    RETURNING *;`
    const valeurs = [nom, type_primaire, type_secondaire, pv, attaque, defense, id];
    try {
        const resultats = await pool.query(requete, valeurs);
        if (resultats.rows.length === 0) {
            return null; // Aucun pokemon modifié, id non trouvé
        }
        return resultats.rows[0]; // Pokemon modifié avec succès
    } catch (erreur) {
        console.error(`Erreur modifiePokemon(): ${erreur}`);
        throw erreur;
    }
};

// returns: true si pokemon supprimé, false si id non trouvé
export async function supprimePokemon(id) {

    const requete = `DELETE FROM public.pokemon WHERE id = $1`;
    const valeurs = [id];
    try {
        const resultats = await pool.query(requete, valeurs);
        return (resultats.rowCount != 0);
    } catch (erreur) {
        console.error(`Erreur supprimePokemon(): ${erreur}`);
        throw erreur;
    }
}