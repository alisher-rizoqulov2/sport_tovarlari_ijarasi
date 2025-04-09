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

app.use(urlerror)
app.use(errrorHandling)
async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    app.listen(PORT, () => {
      console.log(`Server started at: http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error("Serverda ulanishda xatolik"+error.message)
    console.log(error);
  }
}

start();
