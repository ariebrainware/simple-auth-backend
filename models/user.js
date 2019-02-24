'use strict'
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    online: DataTypes.BOOLEAN,
  }, {})
  user.associate = function(models) {
    // associations can be defined here
  }
  return user
};
