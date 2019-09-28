'use strict'
module.exports = (sequelize, DataTypes) => {
  const AssoUser = sequelize.define('AssoUser', {
    hasReservationRight: DataTypes.BOOLEAN
  }, {})
  AssoUser.associate = function(models) {
    // associations can be defined here
  }
  return AssoUser
}