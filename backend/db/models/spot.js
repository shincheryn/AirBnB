'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {

    static associate(models) {
      // One-to-many association with Review
      Spot.hasMany(models.Review, {foreignKey: 'spotId'});

      // One-to-many relationship with Booking
      Spot.hasMany(models.Booking, {foreignKey: 'spotId'});

      // Many-to-one relationship with Image (polymorphic)
      Spot.hasMany(models.Image, {
        foreignKey: 'imageableId',
        constraints: false,
        scope: {
          imageableType: 'Spot'
        },
        //alias for Spot Images
        as: 'SpotImages'

      });

      // Many-to-one relationship with User
      Spot.belongsTo(models.User, {foreignKey: 'ownerId', as: "Owner"});
    }
  };

  Spot.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 255] //VARCHAR(255)
      }
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 255] //VARCHAR(255)
      }
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 255] //VARCHAR(255)
      }
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 255] //VARCHAR(255)
      }
    },
    lat: {
      type: DataTypes.FLOAT,
      allowNull: false,
        validate: {
          isFloat: true,
          min:-90, // Minimum latitude value is -90
          max:90 // Maximum latitude value is 90
        },
    },
    lng: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        isFloat: true,
        min: -180, // Minimum longitude value is -180
        max: 180 // Maximum longitude value is 180
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 255] //VARCHAR(255)
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    previewImage: {
      type: DataTypes.TEXT,
      validate: {
        isUrl: true
      }
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'Spot',
  });

  return Spot;
};
