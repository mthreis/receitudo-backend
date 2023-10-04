
const Pool = require("pg").Pool;

require("dotenv").config();

const pool = new Pool({ connectionString: process.env.DB_URI });

module.exports = pool;