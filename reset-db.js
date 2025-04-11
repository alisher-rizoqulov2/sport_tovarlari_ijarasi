const { Sequelize } = require("sequelize");
const config = require("config");

// Create a connection to the postgres database (not the application database)
const pgConnection = new Sequelize(
  "postgres",
  config.get("db_username"),
  config.get("db_password"),
  {
    host: config.get("db_host"),
    port: config.get("db_port"),
    dialect: "postgres",
    logging: false,
  }
);

async function resetDatabase() {
  try {
    // Connect to postgres database
    await pgConnection.authenticate();
    console.log("Connected to PostgreSQL server");

    // Drop the database if it exists
    const dbName = config.get("db_name");
    await pgConnection.query(`DROP DATABASE IF EXISTS "${dbName}"`);
    console.log(`Database ${dbName} dropped successfully`);

    // Create a new database
    await pgConnection.query(`CREATE DATABASE "${dbName}"`);
    console.log(`Database ${dbName} created successfully`);

    console.log("Database reset completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error resetting database:", error);
    process.exit(1);
  }
}

resetDatabase();
