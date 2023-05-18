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
        }
      });

      // One-to-many association with Spot
      Image.belongsTo(models.Spot, {
        foreignKey: 'id',
        constraints: false,
        scope: {
          id: 'Spot'
        }
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
        validate: {
          isUrl: true,
          len: [1, 2048], // MAX length of URL
        },
      },
      preview: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        validate: {
          isNumeric: true,
        },
      },
    },
    {
      sequelize,
      modelName: 'Image',
    }
  );

  return Image;
};
