const express = require('express');
const router = express.Router();
const { Op, Sequelize } = require('sequelize');
const { User, Spot, Review, Image, Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

// Add an Image to a Review Based on Review's Id
router.post('/:id/images', requireAuth, async (req, res, next) => {
    const reviewId = req.params.id;
    const { url, preview } = req.body;

    // Check if Review Exists
    const review = await Review.findByPk(reviewId);
    if (!review) {
      const err = new Error('Review Not Found');
      err.status = 404;
      return next(err);
    }

    // Check if Review belongs to the Current User
    if (review.userId !== req.user.id) {
      const err = new Error('Unauthorized User');
      err.status = 403;
      return next(err);
    }

    // Check if Maximum Number of Images is Reached
    const imageCount = await Image.count({
      where: {
        imageableId: reviewId,
        imageableType: 'ReviewImages',
      },
    });

    if (imageCount >= 10) {
      const err = new Error('Maximum number of images for this resource was reached');
      err.status = 403;
      return next(err);
    }

    // Create Image
    const newImage = await Image.create({
      imageableId: reviewId,
      imageableType: 'ReviewImages',
      url,
      preview
    });

    // Return New Image
    return res.json({
      id: newImage.id,
      url: newImage.url,
    });
  });


// *Edit a Review*
router.put('/:id', requireAuth, async (req, res, next) => {
    const reviewId = req.params.id;
    const { review: updatedReview, stars } = req.body;

    // Check if Review Exists
    const review = await Review.findByPk(reviewId);
    if (!review) {
      const err = new Error('Review Not Found');
      err.status = 404;
      return next(err);
    }

    // Check if Review belongs to Current User
    if (review.userId !== req.user.id) {
      const err = new Error('Unauthorized User');
      err.status = 403;
      return next(err);
    }

    // Validate Request Body
    if (!updatedReview || !stars) {
      const err = new Error('Bad Request');
      err.status = 400;
      return next(err);
    }

    // Update Review
    review.review = updatedReview;
    review.stars = stars;
    await review.save();

    return res.json(review);
});


module.exports = router;
