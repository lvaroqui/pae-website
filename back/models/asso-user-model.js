'use strict';
module.exports = (sequelize, DataTypes) => {
  const AssoUser = sequelize.define('AssoUser', {
  }, {});
  AssoUser.associate = function(models) {
    // associations can be defined here
  };
  return AssoUser;
};