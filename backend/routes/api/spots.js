const express = require('express');
const router = express.Router();
const { Op, Sequelize } = require('sequelize');
const { User, Spot, Review, Image, Booking } = require('../../db/models');

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

    return res.json({ Spots: spots });
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

//*Get Details for Spot from Id*
router.get('/:id', async (req, res) => {
    const spotId = req.params.id;
    const spot = await Spot.findByPk(spotId, {
      include: [
        {
          model: User,
          as: 'Owner',
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: Image,
          as: 'SpotImages',
          attributes: ['url', 'preview'],
        },
        {
          model: Review,
          attributes: []
        }
      ],
      attributes: {
        include: [
          [ Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgRating' ],
          [ Sequelize.fn('COUNT', Sequelize.col('Reviews.id')), 'numReviews' ],
        ]
      }
    });

    //If Spot Not Found
    if (!spot) {
      return res.status(404).json({ message: 'Spot Not Found' });
    }

    //If Spot Found
    return res.status(200).json({
      ownerId: spot.ownerId,
      address: spot.address,
      city: spot.city,
      state: spot.state,
      country: spot.country,
      lat: spot.lat,
      lng: spot.lng,
      name: spot.name,
      description: spot.description,
      price: spot.price,
      createdAt: spot.createdAt,
      updatedAt: spot.updatedAt,
      numReviews: spot.getDataValue('numReviews'),
      avgStarRating: spot.getDataValue('avgRating'),
      SpotImages: spot.SpotImages,
      Owner: spot.Owner,
    });
});

// Get all Bookings for a Spot based on Spot Id
// router.get('/:spotId/bookings', async (req, res) => {
//     const spotId = req.params.spotId;

//     // Check if Spot exists
//     const spot = await Spot.findByPk(spotId);
//     if (!spot) {
//       return res.status(404).json({ message: 'Spot Not Found' });
//     }

//     // Find Bookings for Spot
//     const bookings = await Booking.findAll({
//       where: { spotId },
//       include: {
//         model: User,
//         attributes: ['firstName', 'lastName'],
//       },
//     });

//     // Check Current User is Spot Owner
//     const userId = parseInt(req.user.id);
//     const ownerId = parseInt(spot.ownerId);
//     if (ownerId === userId) {
//       return res.json({ Bookings: bookings });
//     }

//     // If Current User is NOT Spot Owner, return just Spot
//     const spotBookings = [];
//     for (const booking of bookings) {
//       const { spotId, startDate, endDate } = booking;
//       spotBookings.push({ spotId, startDate, endDate });
//     }

//   return res.json({ Bookings: spotBooking });
// });

module.exports = router;
