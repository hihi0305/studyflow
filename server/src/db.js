const { Pool } = require("pg");

const pool = new Pool({
  connectionString: 
    process.env.DATABASE_URL || 
    `postgresql://${process.env.DB_USER || "postgres"}:${process.env.DB_PASSWORD || "postgrespassword"}@${process.env.DB_HOST || "db"}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || "studyflow_db"}`,
});

module.exports = pool;
