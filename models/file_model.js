
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/DB'); // assuming you have a database configuration file

const UploadedFile = sequelize.define('UploadedFile', {

  fileId:{
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },

  filename: {
    type: DataTypes.STRING,
    allowNull: false,
    //unique: true,
  },
});

module.exports = UploadedFile;
