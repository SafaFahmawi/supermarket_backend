
const { Sequelize } = require('sequelize');
const databaseConfig = require('../databaseConfig');

// Replace with your database credentials
const sequelize = new Sequelize(
  databaseConfig.DB_NAME,
  databaseConfig.DB_USER,
  databaseConfig.DB_PASSWORD, {
  host: databaseConfig.DB_HOST,  // Replace with your database host
  dialect: databaseConfig.DB_DIALECT
});

sequelize.query(`CREATE DATABASE IF NOT EXISTS ${databaseConfig.DB_NAME};`)
sequelize.query(`CREATE USER IF NOT EXISTS 'user'@'%' IDENTIFIED BY 'safa@123456789';`)
sequelize.query(`GRANT ALL PRIVILEGES ON supermarket_db.* TO 'user'@'%';`)

// Synchronize the model with the database
//force: true => will drop the table if it already exists
sequelize.sync({ force: true })
  .then(() => {
    console.log('connecting to MySQL Database!');
  })
  .catch((err) => {
    console.error('Error synchronizing models with the database:', err);
  });

module.exports = sequelize;
