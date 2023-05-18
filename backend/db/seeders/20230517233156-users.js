'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        firstName: "John",
        lastName: "Smith",
        email: "john.smith@gmail.com",
        username: "JohnSmith",
        hashedPassword: bcrypt.hashSync('password1')
      },
      {
        firstName: "Jane",
        lastName: "Doe",
        email: "jane.doe@gmail.com",
        username: "JaneDoe",
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        firstName: "Jeff",
        lastName: "Shin",
        email: "jeff.shin@gmail.com",
        username: "JeffShin",
        hashedPassword: bcrypt.hashSync('password3')
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
