'use strict'
module.exports = (sequelize, DataTypes) => {
  const Asso = sequelize.define('Asso', {
    name: DataTypes.STRING
  }, {})
  Asso.associate = function(models) {
    Asso.hasMany(models.Event)
    Asso.belongsToMany(models.User, { through: models.AssoUser })
  }
  return Asso
}