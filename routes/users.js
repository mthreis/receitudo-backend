
const router = require("express").Router();

router.get("/users", (req, res) => {
    const query = `SELECT * FROM users;`

    client.query(query, (err, results) => {
        if (err) {
            res.status(500).send(err);
            throw err;
        }

        res.status(200).send(results.rows);
    });
});

module.exports = router;