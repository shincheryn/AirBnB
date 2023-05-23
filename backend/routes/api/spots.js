const express = require('express');
const router = express.Router();
const { Op, Sequelize } = require('sequelize');
const { Spot, Review } = require('../../db/models');

// Get all Spots
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

//Create a Spot
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

// Edit a Spot
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

//Delete a Spot
//router.delete('/', async(req, res) => {
//const { id } = req.params;
// const spot = await Spot.findByPk(id);
// if (!spot) {
//   return res.status(404).json({ error: 'Spot not found' });
// }
// await spot.destroy();
//}

//Get details for a Spot from an Id
// router.get('/spots/:id', async (req, res, next) => {

//     const spotId = req.params.id;
//     const spot = await Spot.findByPk({
//       where: { id: spotId },
//       include: [
//         {
//           model: SpotImage,
//           attributes: ['id', 'url', 'preview'],
//         },
//         {
//           model: User,
//           as: 'Owner',
//           attributes: ['id', 'firstName', 'lastName'],
//         },
//       ],
//     });

//     if (!spot) {
//       return res.status(404).json({ message: "Spot couldn't be found" });
//     }

    // const { id, ownerId, address, city, state, country, lat, lng, name, description, price, createdAt, updatedAt } = spot;
    // const spotImages = spot.SpotImages;
    // const owner = spot.Owner;

    // const numReviews = spot.Reviews.length;
    // const avgStarRating = spot.Reviews.length > 0 ? spot.Reviews.reduce((sum, review) => sum + review.stars, 0) / spot.Reviews.length : 0;

// });


module.exports = router;
