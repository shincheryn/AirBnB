'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Images', [
      {
        imageableId: 1,
        imageableType: 'Review',
        url: 'image url',
        preview: true,
        createdAt: "2021-11-19 20:39:36",
        updatedAt: "2021-11-19 20:39:36"
      },
      {
        imageableId: 2,
        imageableType: 'Spot',
        url: 'image url',
        preview: false,
        createdAt: "2022-11-19 20:39:36",
        updatedAt: "2022-11-19 20:39:36",
      },
      {
        imageableId: 3,
        imageableType: 'Spot',
        url: 'image url',
        preview: true,
        createdAt: "2022-11-19 20:39:36",
        updatedAt: "2022-11-19 20:39:36",
      },
      {
        imageableId: 4,
        imageableType: 'Review',
        url: 'image url',
        preview: false,
        createdAt: "2022-11-19 20:39:36",
        updatedAt: "2022-11-19 20:39:36",
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Images', null, {});
  }
};
