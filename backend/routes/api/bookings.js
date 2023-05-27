const express = require('express');
const router = express.Router();
const { Op, Sequelize } = require('sequelize');
const { User, Spot, Review, Image, Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

//Edit a Booking
router.put('/:id', requireAuth, async (req, res, next) => {
    const bookingId = req.params.id;
    const { startDate, endDate } = req.body;

    // Check if Booking Exists
    const booking = await Booking.findByPk(bookingId);
    if (!booking) {
      const err = new Error('Booking Not Found');
      err.status = 404;
      return next(err);
    }

    // Check if Booking belongs to Current User
    if (booking.userId !== req.user.id) {
      const err = new Error('Unauthorized User');
      err.status = 403;
      return next(err);
    }

    // Check if Booking is Past
    const currentDate = new Date();
    if (currentDate > booking.endDate) {
      const err = new Error("Past bookings cannot be modified");
      err.status = 403;
      return next(err);
    }

    // Body Validation
    if (new Date(endDate) <= new Date(startDate)) {
        const err = new Error ('End date cannot be on or before the start date')
        res.status(400);
        return next(err);
        }

    // Check for Booking Conflict
    const spotId = booking.spotId;
    const conflict = await Booking.findOne({
      where: {
        spotId,
        [Op.or]: [
          {
            startDate: {
              [Op.lte]: endDate,
            },
            endDate: {
              [Op.gte]: startDate,
            },
          },
        ],
      },
    });

    if (conflict && conflict.id !== bookingId) {
      const err = new Error('Booking conflict');
      err.status = 403;
      err.errors = {
        startDate: 'Start date conflicts with an existing booking',
        endDate: 'End date conflicts with an existing booking',
      };
      return next(err);
    }

    // Update Booking
    booking.startDate = startDate;
    booking.endDate = endDate;
    await booking.save();

    return res.status(200).json(booking);
  });


//Delete a Booking
router.delete('/:id', requireAuth, async (req, res, next) => {
    const bookingId = req.params.id;

    // Check if Booking Exists
    const booking = await Booking.findByPk(bookingId);
    if (!booking) {
      const err = new Error('Booking Not Found');
      err.status = 404;
      return next(err);
    }

    // Check if BOOKING OR SPOT belongs to Current User
    if (booking.userId !== req.user.id && booking.spot.userId !== req.user.id) {
      const err = new Error('Unauthorized User');
      err.status = 403;
      return next(err);
    }

    // Check if Booking has already started
    const currentDate = new Date();
    if (currentDate >= booking.startDate) {
      const err = new Error("Bookings that have been started cannot be deleted");
      err.status = 403;
      return next(err);
    }

    // Delete Booking
    await booking.destroy();

    return res.status(200).json({ message: 'Successfully deleted' });
  });

module.exports = router;
