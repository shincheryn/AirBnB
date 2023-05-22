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
        }
      });

      // Many-to-one relationship with User
      Spot.belongsTo(models.User, {foreignKey: 'ownerId'});
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
      type: DataTypes.FLOAT(10, 8),
      allowNull: false,
        validate: {
          isFloat: true,
          min:10, // Minimum latitude value is -90
          max:8 // Maximum latitude value is 90
        },
    },
    lng: {
      type: DataTypes.DECIMAL(11,8),
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
      // defaultValue: true
    },
    price: {
      type: DataTypes.FLOAT(10,2),
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
