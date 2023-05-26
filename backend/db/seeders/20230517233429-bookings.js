'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    await queryInterface.bulkInsert(options, [
        {
          spotId: 1,
          userId: 2,
          startDate: "2021-11-19",
          endDate: "2021-11-20",
          createdAt: "2021-11-19 20:39:36",
          updatedAt: "2021-11-19 20:39:36"
        },
        {
          spotId: 2,
          userId: 1,
          startDate: "2021-11-19",
          endDate: "2021-11-20",
          createdAt: "2021-11-19 20:39:36",
          updatedAt: "2021-11-19 20:39:36"
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    await queryInterface.bulkDelete(options, null, {});
  }
};
