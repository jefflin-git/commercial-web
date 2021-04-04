'use strict';
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Products',
      Array.from({ length: 10 }).map((item, index) => ({
        id: index + 1,
        name: faker.commerce.productName(),
        description: faker.commerce.product() + '/' + faker.commerce.productName(),
        price: faker.commerce.price(),
        image: faker.image.imageUrl(),
        viewCounts: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Products', null, {})
  }
};
