'use strict';
const moment = require('moment')
const Op = require('sequelize').Op

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
  }, {
    validate: {
      async noCollision() {
        const myStart = moment(this.start).add(1, 'minute').toDate()
        const myEnd = moment(this.end).subtract(1, 'minute').toDate()
        const events = await Event.findAll({
          where: {
            [Op.or]: [
              {[Op.or]: [
                { start: { [Op.between]: [myStart, myEnd] }},
                { end: { [Op.between]: [myStart, myEnd] }}
              ]},
              {[Op.and]: [
                { start: { [Op.lt]: myStart }},
                { end: { [Op.gt]: myEnd }}
              ]}
            ],
            RoomId: this.RoomId,
            id: {
              [Op.ne]: this.id
            }
          }
        })
        if (events.length > 0) {
          throw new Error('Il y a déjà une réservation sur ce créneau.')
        }
      },
      startIsBeforeEnd() {
        if (this.start >= this.end) {
          throw new Error("Le début de l'évènement ne peut pas être après sa fin.")
        }
      },
      sameDay() {
        if (!moment(this.start).isSame(this.end, 'day')) {
          throw new Error("Le début et la fin de l'évènement doivent être le même jour.")
        }
      },
      notASunday() {
        if (moment(this.start).day() === 0) {
          throw new Error("Vous ne pouvez pas faire de réservation un Dimanche.")
        }
      }
    }
  });
  Event.associate = function(models) {
    Event.belongsTo(models.User)
    Event.belongsTo(models.Room)
    Event.belongsTo(models.Asso)
  };
  return Event;
};