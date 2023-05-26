'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {

    static associate(models) {
      // One-to-many association with Review
      Image.belongsTo(models.Review, {
        foreignKey: 'imageableId',
        constraints: false,
        scope: {
          imageableType: 'Review'
        },
        as: 'ReviewImages'
      });

      // One-to-many association with Spot
      Image.belongsTo(models.Spot, {
        foreignKey: 'id',
        constraints: false,
        scope: {
          id: 'Spot'
        },
        as: 'SpotImages'
      });
    }
  };

  Image.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      imageableId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      imageableType: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1, 255], // VARCHAR(255)
        },
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      preview: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Image',
    }
  );

  return Image;
};
