'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Images';
    await queryInterface.bulkInsert(options, [
      {
        imageableId: 1,
        imageableType: 'Review',
        url: 'https://cdn.britannica.com/13/77413-050-95217C0B/Golden-Gate-Bridge-San-Francisco.jpg',
        preview: true,
        createdAt: "2021-11-19 20:39:36",
        updatedAt: "2021-11-19 20:39:36"
      },
      {
        imageableId: 2,
        imageableType: 'Spot',
        url: 'https://www.travelandleisure.com/thmb/91pb8LbDAUwUN_11wATYjx5oF8Q=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/new-york-city-evening-NYCTG0221-52492d6ccab44f328a1c89f41ac02aea.jpg',
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
    options.tableName = 'Images';
    await queryInterface.bulkDelete(options, null, {});
  }
};
