const express = require('express');
const router = express.Router();
const { Op, Sequelize } = require('sequelize');
const { User, Spot, Review, Image, Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');


//Delete a Spot/Review Image (Polymorphic)
router.delete('/:id', requireAuth, async (req, res, next) => {
    const imageId = req.params.id;
    const ownerId = req.user.id;

    // Check if Image Exists
    const image = await Image.findByPk(imageId);

    if (!image) {
        const err = new Error ('Image Not Found');
        res.status(404);
        return next(err);
    }

    // Check Imageable Type, Find Images from Each Table, Check If Spot Id is Correct Imageable Id
    let boolean = false;
    if (image.imageableType === 'SpotImages') {
        const spots = await Spot.findAll({ where: {ownerId} });

        for (let i = 0; i < spots.length; i++) {
            if (spots[i].id === image.imageableId) {
                boolean = true;
            }
        }

    } else if (image.imageableType === 'ReviewImages') {
        const reviews = await Review.findAll({ where: {userId: ownerId}});

        for (let i = 0; i < reviews.length; i++) {
            if (reviews[i].id === image.imageableId) {
                boolean = true;
            }
        }
    }
    
    if (!boolean) {
        const err = new Error('Unauthorized User');
        err.status = 403;
        return next(err);
    }

    //Delete Image
    await image.destroy();

    return res.status(200).json({ message: 'Successfully deleted' });
  });


module.exports = router;
