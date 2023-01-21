const Sequelize = require("sequelize");

const sequelize = new Sequelize("toughts2", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

try {
  sequelize.authenticate();
  console.log("process connect database sucesss");
} catch (error) {
  console.error(`error connect database, info: ${error}`);
}

module.exports = sequelize;
