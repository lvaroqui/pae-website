'use strict';
const moment = require('moment');
const models = require('../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.bulkInsert('Rooms', [{
      name: 'FA109',
      color: 'orange',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'FA107',
      color: 'green',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

    const room = await models.Room.findOne({
      where: {
          name: 'FA109',
      }})

    return await queryInterface.bulkInsert('Events', [{
      roomId: room.id,
      userId: '45617374-6572-2065-6767-7321202b5f2b',
      details: 'Réservation Test',
      start: moment().startOf('isoWeek').add(1, 'd').hour(19).toDate(),
      end: moment().startOf('isoWeek').add(1, 'd').hour(21).toDate(),
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Rooms', null, {});
  }
};
