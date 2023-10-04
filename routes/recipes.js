
const router = require("express").Router();
const pool = require("../db");

router.get("/", getFirst20);
router.get("/:recipe_id", getByID);
router.delete("/:recipe_id", deleteRecipe);
router.post("/", postRecipe);
router.patch("/:recipe_id", patchRecipe);

function getByID(req, res) {
    const query = 
    `
        SELECT 
        recipes.recipe_id, recipes.name, recipes.creator_id, users.name AS creator_name, recipes.created_at, recipes.ratings, recipes.prep_time, recipes.difficulty,
        recipes.steps, recipes.ingredients, recipes.image

        FROM recipes
        RIGHT JOIN users
        ON users.user_id = recipes.creator_id
        WHERE recipes.recipe_id = $1;
    `

    pool.query(query, [req.params.recipe_id], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }

        if (results.rows.length === 0) {
            return res.status(404).send({
                message: `Recipe(${ req.params.recipe_id }) wasn't found.`
            });
        }

        const r = results.rows[0];

        res.status(200).send({
            recipe_id: r.recipe_id,
            name: r.name,
            created_at: r.created_at,
            ratings: r.ratings,
            prep_time: r.prep_time,
            difficulty: r.difficulty,
            steps: r.steps,
            ingredients: r.ingredients,
            image: r.image,
            creator: {
                id: r.creator_id,
                name: r.creator_name
            }
        });
    });
}

function getFirst20(req, res) {
    const query = 
    `
    SELECT 
        recipes.recipe_id, recipes.name, recipes.creator_id, users.name AS creator_name, 
        recipes.created_at as created_at, recipes.ratings, recipes.prep_time, recipes.difficulty, recipes.image

        FROM recipes
        RIGHT JOIN users
        ON users.user_id = recipes.creator_id
        LIMIT 20;
    `

    pool.query(query, (err, results) => {
        if (err) {
            res.status(500).send(err);
            throw err;
        }

        res.status(200).send(results.rows);
    });
}

function deleteRecipe(req, res) {
    const query = 
    `
    DELETE FROM recipes
    WHERE recipe_id = $1;
    `

    const values = [ req.params.recipe_id ];

    pool.query(query, values, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }

        if (results.rowCount == 0) {
            return res.status(404).send({
                message: `Recipe(${req.params.recipe_id}) doesn't exist.`
            });
        }

        res.status(200).send({
            message: `Recipe(${req.params.recipe_id}) has just been deleted.`
        });
    });
}

function postRecipe(req, res) {
    const query = 
    `
    INSERT INTO recipes 
        (name, created_at, creator_id, ratings, prep_time, difficulty, steps, ingredients) 
    VALUES
        ($1, NOW(), $2, 0, $3, $4, $5, $6)
    RETURNING creator_id, recipe_id;
    `

    const values = [ req.body.name, req.body.creatorID, req.body.prepTime, req.body.difficulty, req.body.steps, req.body.ingredients];

    pool.query(query, values, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }

        const r = results.rows[0];

        res.status(202).send({
            message: `Recipe(${ r.recipe_id }) has just been added to User(${ r.creator_id }).`
        });
    });
}

function patchRecipe(req, res) {
    const query = 
    ` 
    UPDATE recipes
    SET ${ req.body.key } = $2
    WHERE recipe_id = $1;
    `;

    console.log("----------------");
    console.log(query);

    const values = [ req.params.recipe_id, req.body.value ];

    pool.query(query, values, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }

        return res.status(200).send(results);
    });
}

module.exports = router;