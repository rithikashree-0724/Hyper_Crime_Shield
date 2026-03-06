const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
  logging: false
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("MySQL Database Connected Successfully.");

    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log("Database Synced.");
    }
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

module.exports = { sequelize, connectDB };