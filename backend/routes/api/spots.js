const express = require('express');
const router = express.Router();
const { Op, Sequelize } = require('sequelize');
const { User, Spot, Review, Image, Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

// *GET ALL SPOTS & ADD QUERY FILTERS*
router.get('/', async (req, res) => {
    let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

    page = parseInt(page);
    size = parseInt(size);

    //Limit Page and Size
    if (Number.isNaN(page) || page <= 0 || page > 10) {
      page = 1;
    }

    if (Number.isNaN(size) || size <= 0 || size > 20) {
      size = 20;
    }

    // Validate Query Parameters
    const errors = {};
    if (minLat && isNaN(minLat)) {
      errors.minLat = 'Minimum latitude is invalid';
    }
    if (maxLat && isNaN(maxLat)) {
      errors.maxLat = 'Maximum latitude is invalid';
    }
    if (minLng && isNaN(minLng)) {
      errors.minLng = 'Minimum longitude is invalid';
    }
    if (maxLng && isNaN(maxLng)) {
      errors.maxLng = 'Maximum longitude is invalid';
    }
    if (minPrice && (isNaN(minPrice) || minPrice < 0)) {
      errors.minPrice = 'Minimum price must be a number greater than or equal to 0';
    }
    if (maxPrice && (isNaN(maxPrice) || maxPrice < 0)) {
      errors.maxPrice = 'Maximum price must be a number greater than or equal to 0';
    }

    if (Object.keys(errors).length > 0) {
      const err = new Error ('Bad Request');
      err.status = 400;
      err.errors = errors;
      return next(err);
    }

    // Query Filters
    minLat = parseFloat(minLat) || -1000;
    maxLat = parseFloat(maxLat) || 1000;
    maxLng = parseFloat(maxLng) || 1000;
    minLng = parseFloat(minLng) || -1000;
    minPrice = parseFloat(minPrice) || 0;
    maxPrice = parseFloat(maxPrice) || 1000;

    let avgRating = Sequelize.fn('AVG', Sequelize.cast(Sequelize.col('Reviews.stars'),'FLOAT'));

    const spots = await Spot.findAll({
      group: [
        'Spot.id',
      ],

      where: {
        lat: { [Op.between]: [minLat, maxLat] },
        lng: { [Op.between]: [minLng, maxLng] },
        price: { [Op.between]: [minPrice, maxPrice] },
      },

      offset: (page - 1) * size,
      limit: size,

      include: {
        model: Review,
        duplicating: false,
        required: false,
        attributes: [],
      },

      attributes: [
        'id',
        'ownerId',
        'address',
        'city',
        'state',
        'country',
        'lat',
        'lng',
        'name',
        'description',
        'price',
        'createdAt',
        'updatedAt',
        [avgRating, 'avgRating']
      ],
    });

    return res.json({
      Spots: spots,
      page,
      size,
    });
});


// *CREATE A SPOT*
router.post('/', async (req, res, next) => {
  const ownerId = req.user.id;
  const { address, city, state, country, lat, lng, name, description, price } = req.body;

    // Body Validation
    const errors = {};
    if (typeof address !== 'string') {
      errors.address = 'Street address is required';
    }
    if (typeof city !== 'string') {
      errors.city = 'City must be a string';
    }
    if (typeof state !== 'string') {
      errors.state = 'State is required';
    }
    if (typeof country !== 'string') {
      errors.country = 'Country is required';
    }
    if (typeof lat !== 'number') {
      errors.lat = 'Latitude is required';
    }
    if (typeof lng !== 'number') {
      errors.lng = 'Longitude is required';
    }
    if (typeof name !== 'string') {
      errors.name = 'Name is required';
    }
    if (typeof description !== 'string') {
      errors.description = 'Description is required';
    }
    if (typeof price !== 'number') {
      errors.price = 'Price is required';
    }

    if (Object.keys(errors).length > 0) {
      const err = new Error('Bad Request');
      err.status = 400;
      err.errors = errors;
      return next(err);
    }

  // Create Spot
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

    return res.status(201).json(spot);

});


// *ADD AN IMAGE TO A SPOT BASED ON SPOT ID*
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
      imageableId: spotId,
      imageableType: 'SpotImages',
      url,
      preview
    });

    return res.json({id: newImage.id, url: newImage.url, preview: newImage.preview });

});

// *EDIT A SPOT*
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

    // Body Validation
    const errors = {};
    if (typeof address !== 'string') {
      errors.address = 'Street address is required';
    }
    if (typeof city !== 'string') {
      errors.city = 'City must be a string';
    }
    if (typeof state !== 'string') {
      errors.state = 'State is required';
    }
    if (typeof country !== 'string') {
      errors.country = 'Country is required';
    }
    if (typeof lat !== 'number') {
      errors.lat = 'Latitude is required';
    }
    if (typeof lng !== 'number') {
      errors.lng = 'Longitude is required';
    }
    if (typeof name !== 'string') {
      errors.name = 'Name is required';
    }
    if (typeof description !== 'string') {
      errors.description = 'Description is required';
    }
    if (typeof price !== 'number') {
      errors.price = 'Price is required';
    }

    if (Object.keys(errors).length > 0) {
      const err = new Error('Bad Request');
      err.status = 400;
      err.errors = errors;
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


// *DELETE A SPOT*
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
    return res.status(200).json({ message: 'Successfully deleted' });
});


//*GET DETAILS OF A SPOT FROM AN ID*
router.get('/:id', async (req, res, next) => {
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
          attributes: ['id', 'url', 'preview'],
        },
        {
          model: Review,
          attributes: [],
        }
      ],
      attributes: {
        include: [
          'id',
          'ownerId',
          'address',
          'city',
          'state',
          'country',
          'lat',
          'lng',
          'name',
          'description',
          'price',
          'createdAt',
          'updatedAt',
          [ Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgRating' ],
          [ Sequelize.fn('COUNT', Sequelize.col('Reviews.id')), 'numReviews' ],
        ],
      },
      group: [
        'Spot.id',
        'SpotImages.id',
        'Owner.id'
      ],
    });

    //Gets All Spot Images
    spot.SpotImages = await Image.findAll({
      where: {
        imageableId: spotId
      },
      attributes: ['id', 'url', 'preview']
    });

    //If Spot Not Found
    if (!spot) {
      const err = new Error('Spot Not Found');
      err.status = 404;
      return next(err);
    }

    //If Spot Found
    return res.status(200).json({
      id: spot.id,
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
      SpotImages: spot.SpotImages, //showing empty array
      Owner: spot.Owner,
    });
});


// *GET ALL REVIEWS BY SPOT ID*
router.get('/:spotId/reviews', async (req, res, next) => {
  const spotId = req.params.spotId;

  // Check if Spot Exists
  const spot = await Spot.findByPk(spotId);
  if (!spot) {
    const err = new Error('Spot Not Found');
    err.status = 404;
    return next(err);
  }

  // Find all Reviews for Spot
  const reviews = await Review.findAll({
    where: { spotId },
    include: [
      {
        model: User,
        attributes: ['id', 'firstName', 'lastName'],
      },
      {
        model: Image,
        as: 'ReviewImages',
        attributes: ['id', 'url'],
      },
    ],
  });

  return res.json({ Reviews: reviews });
});


// *CREATE A REVIEW FOR A SPOT BASED ON THE SPOT'S ID*
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


// *GET ALL BOOKINGS FOR A SPOT BASED ON SPOT ID*
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

//*CREATE A BOOKING FROM A SPOT BASED ON SPOT ID*
router.post('/:spotId/bookings', requireAuth, async (req, res, next) => {
    const spotId = req.params.spotId;
    const { startDate, endDate } = req.body;

    // Check if Spot exists
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      const err = new Error('Spot Not Found');
      err.status = 404;
      return next(err);
    }

    // Check if Spot belongs to Current User
    if (spot.ownerId === req.user.id) {
      const err = new Error('Unauthorized User');
      err.status = 403;
      return next(err);
    }

    // Body Validation
    if (new Date(endDate) <= new Date(startDate)) {
      const err = new Error ('End date cannot be on or before the start date')
      res.status(400);
      return next(err);
    }

    // Check if Spot is already booked for specified dates
    const existingBooking = await Booking.findOne({
      where: {
        spotId: spot.id,
        [Op.or]: [
          {
            startDate: {
              [Op.lte]: endDate,
            },
            endDate: {
              [Op.gte]: startDate,
            },
          },
          {
            startDate: {
              [Op.between]: [startDate, endDate],
            },
          },
          {
            endDate: {
              [Op.between]: [startDate, endDate],
            },
          },
        ],
      },
    });

    if (existingBooking) {
      const err = new Error('Sorry, this spot is already booked for the specified dates');
      err.status = 403;
      err.errors = {
        startDate: 'Start date conflicts with an existing booking',
        endDate: 'End date conflicts with an existing booking',
      };
      return next(err);
    }

    // Create Booking
    const booking = await Booking.create({
      spotId: spot.id,
      userId: req.user.id,
      startDate,
      endDate,
    });

    // Return New Booking
    return res.status(200).json({
      id: booking.id,
      spotId: booking.spotId,
      userId: booking.userId,
      startDate: booking.startDate,
      endDate: booking.endDate,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    });

});

module.exports = router;
