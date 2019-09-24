'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Assos', [{
      id: 'bf89d540-d7bc-11e9-9825-352a98147279',
      name: 'Stravaganza',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Rooms', null, {})
  }
}
