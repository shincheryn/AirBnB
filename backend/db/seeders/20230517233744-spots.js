'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Spots', [
      {
        ownerId: 1,
        address: "123 Disney Lane",
        city: "San Francisco",
        state: "California",
        country: "United States of America",
        lat: 37.7645358,
        lng: -122.4730327,
        name: "App Academy",
        description: "Place where web developers are created",
        price: 123,
        createdAt: "2021-11-19 20:39:36",
        updatedAt: "2021-11-19 20:39:36",
        previewImage: "image url"
      },
      {
        ownerId: 2,
        address: "456 Universal Lane",
        city: "New York City",
        state: "New York",
        country: "United States of America",
        lat: 40.7645358,
        lng: -122.4730327,
        name: "App Academy",
        description: "Place where web designers are created",
        price: 123,
        createdAt: "2022-11-19 20:39:36",
        updatedAt: "2022-11-19 20:39:36",
        previewImage: "image url"
      },
      {
        ownerId: 3,
        address: "789 Main Street",
        city: "Atlanta",
        state: "Georgia",
        country: "United States of America",
        lat: 40.7645358,
        lng: -122.4730327,
        name: "App Academy",
        description: "Place where software engineers are created",
        price: 345,
        createdAt: "2022-01-01 20:39:36",
        updatedAt: "2022-01-01 20:39:36",
        previewImage: "image url"
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Spots', null, {});
  }
};
