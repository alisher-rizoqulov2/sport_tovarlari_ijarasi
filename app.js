const express = require("express");
const config = require("config");
const sequelize = require("./config/db");
const cookieParser = require("cookie-parser");
const errrorHandling = require("./middleware/errors/errror.handling");

const PORT = config.get("port") || 3030;
const mainRouter = require("./routes/index.routes");
const logger = require("./services/logger.service");
const urlerror = require("./middleware/errors/url");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api", mainRouter);

// app.use(urlerror)
app.use(errrorHandling);
async function start() {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");

    await sequelize.sync({ alter: true });
    console.log("Database models synchronized successfully (tables altered)");

    app.listen(PORT, () => {
      console.log(`Server started at: http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error("Database connection error: " + error.message);
    console.error("Database connection error details:", error);
    process.exit(1); // Exit the process with an error code
  }
}

start();
