
const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/DB');
const bcrypt = require('bcrypt');
const validator = require('validator');

const User = sequelize.define('User', {

  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: {
        args: true,
        msg: 'Invalid email format',
      },
    }
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false
  },

  confirm_Password: {
    type: DataTypes.STRING,
    allowNull: false
  },

});

User.beforeCreate(async (user, options) => {
  if (user.password) {
    const saltRounds = 10;//to control the computational cost of hashing passwords.)(2^10)
    user.password = await bcrypt.hash(user.password, saltRounds);
    user.confirm_Password = await bcrypt.hash(user.confirm_Password, saltRounds);
  }
});

module.exports = User;
