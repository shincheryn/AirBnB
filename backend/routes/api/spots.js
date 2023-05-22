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
// router.post('/', async (req, res) => {
//     const { address, city, state, country, name, description, price } = req.body;
//     const spot = await Spot.create({
//         address, city, state, country, name, description, price
//   });
//     return res.json(spot);
// });

// Edit a Spot
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

//Get all Spots owned by the Current User
//Get details for a Spot from an id



module.exports = router;
