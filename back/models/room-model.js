'use strict';
module.exports = (sequelize, DataTypes) => {
  const Room = sequelize.define('Room', {
    name: {
      allowNull: false,
      unique: true,
      type: DataTypes.STRING
    },
    color: {
      type: DataTypes.STRING
    }
  }, {});
  Room.associate = function(models) {
    Room.hasMany(models.Event)
  };
  return Room;
};