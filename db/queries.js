const pool = require("./pool");

async function getGarbageDayByStreet(name) {
    const {rows} = await pool.query("SELECT * FROM categories WHERE name = $1", [name]);
    return rows[0];
}

async function getAllStreets() {
    const {rows} = await pool.query(
        `SELECT * FROM streets ORDER BY name`
    );
    return rows;
}

async function insertStreet(name, day) {
    const {rows} = await pool.query(
        `INSERT INTO streets (name, day) VALUES ($1, $2) RETURNING *`,
        [name, day]
    );
    return rows[0];
}

async function updateStreet(name, day) {
    const {rows} = await pool.query(
        `UPDATE streets SET day=$2 WHERE name = $1 RETURNING *`,
        [name, day]
    );
    return rows[0];
}

async function deleteStreet(name) {
    await pool.query("DELETE FROM streets WHERE name = $1", [name]);
}

module.exports = {
    getGarbageDayByStreet,
    getAllStreets,
    insertStreet,
    updateStreet,
    deleteStreet
}