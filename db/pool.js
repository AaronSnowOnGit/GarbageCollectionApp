const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",
  user: "aaronsnow",
  database: "garbage_day",
  password: "password",
  port: 5432
});

module.exports = pool;