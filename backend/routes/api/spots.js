const express = require('express');
const router = express.Router();
const { Op, Sequelize } = require('sequelize');
const { User, Spot, Review, Image } = require('../../db/models');

// *Get all Spots*
router.get('/', async (req, res) => {
    const spots = await Spot.findAll({
      include: {
        model: Review,
        attributes: []
      },
      attributes: {
        include: [
          [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgRating']
        ],
      group: [
          'Spot.id',
          'Review.id'
          ],
      }
    });
    return res.json(spots);
});

// *Create a Spot*
router.post('/', async (req, res) => {
  const { ownerId, address, city, state, country, lat, lng, name, description, price } = req.body;
    const spot = await Spot.create({
      ownerId: parseInt(ownerId),
      address,
      city,
      state,
      country,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      name,
      description,
      price: parseFloat(price)
  });
    return res.json(spot);
});

// *Edit a Spot*
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { address, city, state, country, lat, lng, name, description, price } = req.body;

  const spot = await Spot.findByPk(id);
    // Check if Spot exists
    if (!spot) {
      return res.status(404).json({ message: "Spot Not Found" });
    }

    // Check if Spot belongs to Current User
    if (spot.ownerId !== req.user.id) {
      return res.status(400).json({ message: 'Bad Request' });
    }

    // Update Spot
    spot.address = address;
    spot.city = city;
    spot.state = state;
    spot.country = country;
    spot.lat = parseFloat(lat);
    spot.lng = parseFloat(lng);
    spot.name = name;
    spot.description = description;
    spot.price = parseFloat(price);

    await spot.save();

    return res.json(spot);
});

// *Delete a Spot*
router.delete('/:id', async (req, res) => {
  const spotId = req.params.id;
  const spot = await Spot.findByPk(spotId);

  if (!spot) {
    return res.status(404).json({ message: 'Spot Not Found' });
  }

  // Require Authentication: Spot must belong to Current User
  const userId = req.user.id;
  if (spot.ownerId !== userId) {
    return res.status(401).json({ message: 'User Unauthorized' });
  }

  await spot.destroy();
  return res.json({ message: 'Successfully deleted' });
});

//Get details for a Spot from an Id
// router.get('/:id', async (req, res) => {
//   const spotId = req.params.id;
//   const spot = await Spot.findByPk(spotId, {
//     include: [
//       {
//         model: Spot,
//         include: {
//           model: User,
//           as: 'ownerId',
//         },
//       },
//       {
//         model: Image,
//         as: 'SpotImages',
//         attributes: ['id', 'url', 'preview'],
//       },
//     ],
//   });

//   if (!spot) {
//     return res.status(404).json({ message: 'Spot Not Found' });
//   }

//   return res.status(200).json({ Spots: spot });
// });

module.exports = router;
