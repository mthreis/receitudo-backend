
const router = require("express").Router();
const client = require("../db");


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

    client.query(query, [req.params.recipe_id], (err, results) => {
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

function begin(client) {
    console.log("das")
    this.client = client;
}

router.get("/:recipe_id", getByID);

router.get("/", (req, res) => {
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

    client.query(query, (err, results) => {
        if (err) {
            res.status(500).send(err);
            throw err;
        }

        

        res.status(200).send(results.rows);
    });
});



router.post("/", (req, res) => {
    const query = 
    `
    INSERT INTO recipes 
        (name, created_at, creator_id, ratings, prep_time, difficulty, steps, ingredients) 
    VALUES
        ($1, NOW(), $2, 0, $3, $4, $5, $6)
    RETURNING creator_id, recipe_id;
    `

    const values = [ req.body.name, req.body.creatorID, req.body.prepTime, req.body.difficulty, req.body.steps, req.body.ingredients];

    client.query(query, values, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }

        const r = results.rows[0];

        res.status(202).send({
            message: `Recipe(${ r.recipe_id }) has just been added to User(${ r.creator_id }).`
        });
    });
});


router.delete("/:recipe_id", (req, res) => {
    const query = 
    `
    DELETE FROM recipes
    WHERE recipe_id = $1;
    `

    const values = [ req.params.recipe_id ];

    client.query(query, values, (err, results) => {
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
});


router.patch("/:recipe_id", (req, res) => {
    
    
    //const keys = Object.keys(req.body);
    
    //for(var name in req.body) {
    //    console.log(`[${ name }] = ${ req.body[name] }`)
    //}

    /*
    let query = 
    `UPDATE recipes
    SET`;

    for(var name in req.body) {
        query += ` ${ name } = ${ req.body[name] }\n`
    }

    query += "WHERE recipe_id = $1;"
    */

    const query = 
    ` 
    UPDATE recipes
    SET ${ req.body.key } = $2
    WHERE recipe_id = $1;
    `;

    console.log("----------------");
    console.log(query);

    const values = [ req.params.recipe_id, req.body.value ];

    client.query(query, values, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }

        return res.status(200).send(results);

        if (results.rowCount == 0) {
            return res.status(404).send({
                message: `Recipe(${req.params.recipe_id}) doesn't exist.`
            });
        }

        res.status(200).send({
            message: `Recipe(${req.params.recipe_id}) has just been deleted.`
        });
    });
});


module.exports = router;