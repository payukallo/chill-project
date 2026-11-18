const mysql = require("mysql2/promise");
const fs = require("fs");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (question) =>
  new Promise((resolve) => rl.question(question, resolve));

async function testConnection() {
  let connection;

  try {
    const password = await ask("Masukkan password Enzonic: ");
    rl.close();

    connection = await mysql.createConnection({
      host: "chill-database-qrvz76.db.enzonic.com",
      port: 3306,
      user: "u_evskhjp8ut.chill-database-qrvz76",
      password,
      database: "main",
      connectTimeout: 20000,
      ssl: {
        ca: fs.readFileSync("/etc/ssl/certs/ca-certificates.crt"),
        rejectUnauthorized: true,
      },
    });

    const [rows] = await connection.execute(`
      SELECT
        DATABASE() AS database_name,
        VERSION() AS mysql_version
    `);

    console.log("Koneksi Node.js ke Enzonic berhasil!");
    console.table(rows);
  } catch (error) {
    console.error("Koneksi gagal:", error.message);
    process.exitCode = 1;
  } finally {
    rl.close();

    if (connection) {
      await connection.end();
    }
  }
}

testConnection();
