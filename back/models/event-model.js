'use strict';
const moment = require('moment')
module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    details: DataTypes.STRING,
    start: {
      type: DataTypes.DATE,
      allowNull: false,
      get: function() {
        return moment(this.getDataValue('start')).format('YYYY-MM-DD HH:mm')
      }
    },
    end: {
      type: DataTypes.DATE,
      allowNull: false,
      get: function() {
        return moment(this.getDataValue('end')).format('YYYY-MM-DD HH:mm')
      }
    },
  }, {});
  Event.associate = function(models) {
    Event.belongsTo(models.User)
    Event.belongsTo(models.Room)
  };
  return Event;
};