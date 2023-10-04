
const pg = require("pg");

require("dotenv").config();

const client = new pg.Client(process.env.DB_URI);

module.exports = client;