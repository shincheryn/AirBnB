const express = require('express');
const router = express.Router();
const { Op, Sequelize } = require('sequelize');
const { User, Spot, Review, Image, Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

//Delete a Spot/Review Image (Polymorphic)
router.delete('/:id', requireAuth, async (req, res, next) => {
    const imageId = req.params.id;
    const imageableType = imageId.imageableType;
    const imageableId = imageId.imageableId;

    // Check if Image Exists
    const generalImage = await Image.findByPk(imageId);
    if (!generalImage) {
        const err = new Error (`${imageableType} Image Not Found`);
        res.status(404);
        return next(err);
    }

    // Determine Review Image vs Spot Image
    let specificImage;
    let errMsg;

    if (imageableType === 'Spot') {
        specificImage = await Spot.findByPk(imageableId);
        errMsg = 'Spot Image';
    } else if (imageableType === 'Review') {
        const review = await Review.findByPk(imageableId);
        //Review.id --> imageableId --> Spot.id --> spotId
        if (review) {
        specificImage = await Spot.findByPk(review.spotId);
        }
        errMsg = 'Review Image';
    }

    // Check if Image belongs to Current User's Spot
    if (!specificImage || specificImage.userId !== req.user.id) {
        const err = new Error(`Unauthorized User For ${errMsg}`);
        err.status = 403;
        return next(err);
    }

    // Delete Image
    await image.destroy();

    return res.status(200).json({ message: 'Successfully deleted' });
  });


module.exports = router;
