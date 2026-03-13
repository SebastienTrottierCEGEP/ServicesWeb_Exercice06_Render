// Services Web - Exercice 6
// S. Trottier - Cégep de Victoriaville
import pool from "../config/db_pg.js"; // PostgreSQL

// params: 
//  id: number
export async function getPokemonForId(id) {

    const requete = `SELECT id, nom, type_primaire, type_secondaire, pv, attaque, defense FROM pokemon WHERE id = $1;`;
    const parametres = [id];
    try {
        // .query() en PostgreSQL
        const resultats = await pool.query(requete, parametres);
        return resultats.rows[0] || null; // Retourne le premier résultat ou null si aucun résultat
    } catch (erreur) {
        console.error(`Erreur getPokemonForId(), code: ${erreur.code} sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
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
    const requete = `SELECT id, nom, type_primaire, type_secondaire, pv, attaque, defense 
                    FROM pokemon LIMIT $1 OFFSET $2`;
    const parametres = [POKEMONS_PAR_PAGE, offset];
    try {
        const resultats = await pool.query(requete, parametres);
        return resultats.rows;
    } catch (erreur) {
        console.error(`Erreur getPokemons(), code: ${erreur.code} sqlState ${erreur.sqlState} : 
                       ${erreur.sqlMessage}`);
        throw erreur;
    }
};

// returns: int
export async function getTotalPokemons() {
    try {
        const resultats = await pool.query(`SELECT COUNT(*) as total FROM pokemon;`);
        return resultats.rows[0].total;
    } catch (erreur) {
        console.error(`Erreur getTotalPokemons(), code: ${erreur.code} sqlState ${erreur.sqlState} : 
                       ${erreur.sqlMessage}`);
        throw erreur;
    }
};

// params:
//  page: number
//  type: string
export async function getPokemonsPourType(page, type) {

    const offset = (page - 1) * POKEMONS_PAR_PAGE;
    let requete = `SELECT id, nom, type_primaire, type_secondaire, pv, attaque, defense 
                    FROM pokemon WHERE type_primaire = $1 LIMIT $2 OFFSET $3`;
    const parametres = [type, POKEMONS_PAR_PAGE, offset];
    try {
        const resultats = await pool.query(requete, parametres);
        return resultats.rows;
    } catch (erreur) {
        console.error(`Erreur getPokemons(), code: ${erreur.code} sqlState ${erreur.sqlState} : 
                       ${erreur.sqlMessage}`);
        throw erreur;
    }
};

// returns: int
export async function getTotalPokemonsPourType(type) {
    try {
        const resultats = await pool.query(`SELECT COUNT(*) as total FROM pokemon WHERE type_primaire = $1;`, [type]);
        return resultats.rows[0].total;
    } catch (erreur) {
        console.error(`Erreur getTotalPokemonsPourType(), code: ${erreur.code} sqlState ${erreur.sqlState} : 
                       ${erreur.sqlMessage}`);
        throw erreur;
    }
};

// returns: id pokemon créé
export async function ajoutPokemon(nom, type_primaire, type_secondaire, pv, attaque, defense) {
    // Ajoute un nouveau pokemon à la liste
    // console.log(`Ajout du pokemon : nom=${nom}, type_primaire=${type_primaire}, type_secondaire=${type_secondaire}, pv=${pv}, attaque=${attaque}, defense=${defense}`);
    const requete = `INSERT INTO pokemon (nom, type_primaire, type_secondaire, pv, attaque, defense) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;`;
    const valeurs = [nom, type_primaire, type_secondaire, pv, attaque, defense];
    try {
        // .query ou .execute peuvent être utilisés
        // .execute est préféré pour les requêtes avec des valeurs à insérer 
        //   (protection contre les injections SQL)
        const resultats = await pool.query(requete, valeurs);
        // console.log(`Pokemon ajouté avec succès, ID: ${resultat.insertId}`);
        return resultats.rows[0].id;
    } catch (erreur) {
        console.error(`Erreur ajoutPokemon(), code: ${erreur.code} sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
        throw erreur;
    }
};

// returns: pokemon modifié ou null si id non trouvé
export async function modifiePokemon(id, nom, type_primaire, type_secondaire, pv, attaque, defense) {

    // console.log(`Modification du pokemon : id=${id}, nom=${nom}, type_primaire=${type_primaire}, type_secondaire=${type_secondaire}, pv=${pv}, attaque=${attaque}, defense=${defense}`);
    const requete = `UPDATE pokemon SET nom = ?, type_primaire = ?, type_secondaire = ?, 
                     pv = ?, attaque = ?, defense = ? WHERE id = ?`;
    const valeurs = [nom, type_primaire, type_secondaire, pv, attaque, defense, id];
    try {
        // .execute est préféré pour les requêtes avec des valeurs à insérer 
        //   (protection contre les injections SQL)
        const [resultat] = await pool.execute(requete, valeurs);
        if (resultat.affectedRows === 0) {
            return null; // Aucun pokemon modifié, id non trouvé
        }
        return resultat; // Pokemon modifié avec succès
    } catch (erreur) {
        console.error(`Erreur modifiePokemon(), code: ${erreur.code} sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
        throw erreur;
    }
};

// returns: true si pokemon supprimé, false si id non trouvé
export async function supprimePokemon(id) {

    const requete = `DELETE FROM pokemon WHERE id = ?`;
    const valeurs = [id];
    try {
        // .execute est préféré pour les requêtes avec des valeurs à insérer 
        //   (protection contre les injections SQL)
        const [resultat] = await pool.execute(requete, valeurs);
        return (resultat.affectedRows != 0);
    } catch (erreur) {
        console.error(`Erreur supprimePokemon(), code: ${erreur.code} sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
        throw erreur;
    }
}