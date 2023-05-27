const express = require('express');
const router = express.Router();
const { Op, Sequelize } = require('sequelize');
const { User, Spot, Review, Image, Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

//Delete a Spot/Review Image (Polymorphic)
router.delete('/:id', requireAuth, async (req, res, next) => {
    const imageId = req.params.id;

    // Check if Image Exists
    const image = await Image.findByPk(imageId);

    if (!image) {
        const err = new Error ('Image Not Found');
        res.status(404);
        return next(err);
    }

    //Check Imageable Type
    let imageType;
    if (image.imageableType === 'Spot') {
        imageType = Spot;
    } else if (image.imageableType === 'Review') {
        imageType = Review;
    }

    // Check Image belongs to Current User
    const table = await model.findByPk(Image.imageableId);
    if (!table || table.ownerId !== req.user.id) {
        const err = new Error('Unauthorized User');
        err.status = 403;
        return next(err);
    }

    // Delete Image
    await image.destroy();

    return res.status(200).json({ message: 'Successfully deleted' });
  });


module.exports = router;
