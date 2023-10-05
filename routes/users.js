
const router = require("express").Router();
const pool = require("../db");

router.get("/", (req, res) => {
    const query = `SELECT * FROM users;`

    pool.query(query, (err, results) => {
        if (err) {
            return res.status(500).send(err);
            //throw err;
        }

        res.status(200).send(results.rows);
    });
});

module.exports = router;