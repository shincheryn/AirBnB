'use strict';
const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {

      static associate(models) {
      // One-to-many relationship with Booking
      User.hasMany(models.Booking, {foreignKey: 'userId'});

      // One-to-many relationship with Review
      User.hasMany(models.Review, {foreignKey: 'userId'});

      // One-to-many relationship with Spot
      User.hasMany(models.Spot, {foreignKey: 'ownerId'});
    }
  };

  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [4, 30],
          isNotEmail(value) {
            if (Validator.isEmail(value)) {
              throw new Error("Cannot be an email.");
            }
          }
        }
      },
      firstName: {
        type: DataTypes.STRING(256),
        allowNull: false,
        defaultValue: true,
        validate: {
          len: [2, 256],
          isAlphanumeric: true
        }
      },
      lastName: {
        type: DataTypes.STRING(256),
        allowNull: false,
        defaultValue: true,
        validate: {
          len: [2, 256],
          isAlphanumeric: true
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [3, 256],
          isEmail: true
        }
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          len: [60, 60]
        }
      }
    },
    {
      sequelize,
      modelName: "User",
      defaultScope: {
        attributes: {
          exclude: ["firstName", "lastName", "hashedPassword", "email", "createdAt", "updatedAt"]
        }
      }
    }
  );
  return User;
};
