const express = require('express');
const router = express.Router();
const { Op, Sequelize } = require('sequelize');
const { User, Spot, Review, Image, Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

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
      lng: parseFlcurroat(lng),
      name,
      description,
      price: parseFloat(price)
  });
    return res.json(spot);
});


// *Add an Image to a Spot based on Spot Id*
router.post('/:spotId/images', requireAuth, async (req, res, next) => {
  const spotId = req.params.spotId;
  const { url, preview } = req.body;

  // Check if Spot Exists
  const spot = await Spot.findByPk(spotId);
  if (!spot) {
    const err = new Error('Spot Not Found');
    err.status = 404;
    return next(err);
  }

  // Check if Spot belongs to Current User
  if (spot.ownerId !== req.user.id) {
    const err = new Error('Unauthorized User');
    err.status = 403;
    return next(err);
  }

  // Create Image
  const newImage = await Image.create({
    imageableId: spot.id,
    imageableType: 'SpotImages',
    url,
    preview
  });

  return res.json(newImage);
});


// *Edit a Spot*
router.put('/:id', requireAuth, async (req, res, next) => {
    const { id } = req.params;
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    const spot = await Spot.findByPk(id);
      // Check if Spot exists
      if (!spot) {
        const err = new Error('Spot Not Found');
        err.status = 404;
        return next(err);
      }

      // Check if Spot belongs to Current User
      if (spot.ownerId !== req.user.id) {
        const err = new Error('Unauthorized User');
        err.status = 403;
        return next(err);
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
router.delete('/:id', requireAuth, async (req, res, next) => {
    const spotId = req.params.id;
    const spot = await Spot.findByPk(spotId);

    if (!spot) {
      const err = new Error('Spot Not Found');
      err.status = 404;
      return next(err);
    }

    // Require Authentication: Spot must belong to Current User
    const userId = req.user.id;
    if (spot.ownerId !== userId) {
      const err = new Error('User Unauthorized');
      err.status = 401;
      return next(err);
    }

    await spot.destroy();
    return res.json({ message: 'Successfully deleted' });
});


//*Get Details for a Spot from an Id*
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


// *Create a Review for a Spot based on the Spot's Id*
router.post('/:spotId/reviews', async (req, res, next) => {
    const spotId = req.params.spotId;
    const userId = req.user.id;
    const { review, stars } = req.body;

    // Check if Spot Exists
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      const err = new Error('Spot Not Found');
      err.status = 404;
      return next(err);
    }

    // Check if Current User already has Review for Spot
    const existingReview = await Review.findOne({
      where: { spotId, userId },
    });
    if (existingReview) {
      const err = new Error('User already has a review for this spot');
      err.status = 500;
      return next(err);
    }

    // Create Review
    const newReview = await Review.create({
      spotId,
      userId,
      review,
      stars,
    });

    return res.json(newReview);
});


// *Get all Bookings for a Spot based on Spot Id*
router.get('/:spotId/bookings', async (req, res) => {
    const spotId = req.params.spotId;

    // Check if Spot Exists
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      return res.status(404).json({ message: 'Spot Not Found' });
    }

    // Find all Bookings for Current User using Spot Id
    const bookings = await Booking.findAll({
      where: { spotId },
      include: {
        model: User,
        attributes: ['firstName', 'lastName'],
      },
    });

    // Check Current User is Spot Owner
    const userId = parseInt(req.user.id);
    const ownerId = parseInt(spot.ownerId);

    if (ownerId === userId) {
      return res.json({ Bookings: bookings });
    } else {
      let spots = []
      for (let i = 0; i < bookings.length; i++) {
        spots.push(
          {
            spotId: bookings[i].spotId,
            startDate: bookings[i].startDate,
            endDate: bookings[i].endDate
          }
        );
      }
      return res.json({ Bookings: spots });
    }
});


module.exports = router;
