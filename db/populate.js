const { Client } = require("pg");
const fs = require("fs");
const csvParser = require("csv-parser");
const pool = require("./pool");

const filePath = "db/corner_brook_garbage_zones_by_street(in).csv";
const SQL = `
DROP TABLE IF EXISTS streets;

CREATE TABLE streets (
name VARCHAR(100) PRIMARY KEY,
day VARCHAR(25) NOT NULL
);`

async function main() {
    const client = await pool.connect();
    console.log("Connected. Populating database...");

    await client.query(SQL);

    const results = [];

    await new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on("data", row => results.push(row))
            .on("end", resolve)
            .on("error", reject);
    });

    await Promise.all(
        results.map(row => {
            const { name, day } = row;
            if (name && day) {
                return client.query(
                    'INSERT INTO streets (name, day) VALUES ($1, $2)',
                    [name, day]
                );
            }
        })
    );

    client.release();
    console.log("Database populated successfully.");
    await client.end();
}

main().catch((err) => {
    console.error("Error uploading CSV data to database:", err);
    process.exit(1);
});
