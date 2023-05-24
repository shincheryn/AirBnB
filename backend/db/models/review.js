'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {

    static associate(models) {
      // Many-to-one relationship with Image (polymorphic)
      Review.hasMany(models.Image, {
        foreignKey: 'imageableId',
        constraints: false,
        scope: {
          imageableType: 'Review'
        },
        //alias for Review Images
        as: 'ReviewImages'
      });

      // Many-to-one relationship with Spot
      Review.belongsTo(models.Spot, {foreignKey: 'spotId'});

      // Many-to-one relationship with User
      Review.belongsTo(models.User, {foreignKey: 'userId'});

    }
  };

  Review.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      spotId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      review: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      stars: {
        type: DataTypes.INTEGER(1,5),
        allowNull: false,
        validate: {
          min: 1, // Minimum value is 1
          max: 5 // Maximum value is 5
        }
      }
    },
    {
      sequelize,
      modelName: 'Review'
    }
  );

  return Review;
};
