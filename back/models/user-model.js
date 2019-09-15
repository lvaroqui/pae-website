'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    isMu0x: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};