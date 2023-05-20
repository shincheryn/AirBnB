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
    console.log(spots)
    return res.json(spots);
});

// //Create a Spot
// router.post('/', async (req, res) => {
//     const { name, description } = req.body; // Assuming name and description are the required fields
//     const spot = await Spot.create({ name, description });
//     return res.json(spot);
// });

// // Edit a Spot
// router.put('/:id', async (req, res) => {
//     const { id } = req.params;
//     const { name, description } = req.body;
//     const spot = await Spot.findByPk(id);
//     if (!spot) {
//       return res.status(404).json({ error: 'Spot not found' });
//     }
//     //else
//     spot.name = name;
//     spot.description = description;
//     return res.json(spot);

// });

//Delete a Spot
//router.delete('/', async(req, res) => {
//const { id } = req.params;
// const spot = await Spot.findByPk(id);
// if (!spot) {
//   return res.status(404).json({ error: 'Spot not found' });
// }
// await spot.destroy();
//}


module.exports = router;
