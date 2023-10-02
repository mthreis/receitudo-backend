
const express = require("express");
const app = express();
const pg = require("pg");

//postgresql://postgres:root@localhost:5432/receitudo
const client = new pg.Client("postgresql://postgres:root@localhost:5432/receitudo");
client.connect();

app.get("/users", (req, res) => {
    const query = `SELECT * FROM users;`

    client.query(query, (err, results) => {
        if (err) {
            res.status(500).send(err);
            throw err;
        }

        res.status(200).send(results.rows);
    });
});

app.get("/recipes/:recipe_id", (req, res) => {
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
            res.status(500).send(err);
            throw err;
        }

        const recipe = results.rows[0];

        recipe.creator = {
            id: recipe.creator_id,
            name: recipe.creator_name
        };

        delete recipe.creator_id;
        delete recipe.creator_name;

        res.status(200).send(recipe);
    });
});


app.get("/recipes", (req, res) => {
    const query = `SELECT * FROM recipes;`

    client.query(query, (err, results) => {
        if (err) {
            res.status(500).send(err);
            throw err;
        }

        res.status(200).send(results.rows);
    });
});


app.listen(4007);
console.log("olé");