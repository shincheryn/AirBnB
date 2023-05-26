'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    await queryInterface.bulkInsert(options, [
      {
        userId: 1,
        spotId: 1,
        review: "This was an awesome spot!",
        stars: 5,
        createdAt: "2021-11-19 20:39:36",
        updatedAt: "2021-11-19 20:39:36"
      },
      {
        userId: 2,
        spotId: 2,
        review: "This was an okay spot!",
        stars: 3,
        createdAt: "2022-11-19 20:39:36",
        updatedAt: "2022-11-19 20:39:36"
      },
      {
        userId: 3,
        spotId: 2,
        review: "This was a mid spot!",
        stars: 3,
        createdAt: "2022-11-10 20:39:35",
        updatedAt: "2022-11-10 20:39:35"
        }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    await queryInterface.bulkDelete(options, null, {});
  }
};
