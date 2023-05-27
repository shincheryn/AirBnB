// backend/routes/api/users.js
const express = require('express')
const router = express.Router();
const { Op, Sequelize } = require('sequelize');
const { Spot, Review, Image, Booking } = require('../../db/models');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateSignup = [
    check('firstName')
        .exists({ checkFalsy: true })
        .isLength({ min: 2 })
        .withMessage('Please provide a first name'),
    check('lastName')
        .exists({ checkFalsy: true })
        .isLength({ min: 2 })
        .withMessage('Please provide a last name'),
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Please provide a valid email.'),
    check('username')
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email.'),
    check('password')
      .exists({ checkFalsy: true })
      .isLength({ min: 6 })
      .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
  ];

// *SIGN UP*
router.post(
    '',
    validateSignup,
    async (req, res) => {
      const { firstName, lastName, email, password, username } = req.body;
      const hashedPassword = bcrypt.hashSync(password);
      const user = await User.create({ firstName, lastName, email, username, hashedPassword });

      const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
      };

      await setTokenCookie(res, safeUser);

      return res.json({
        user: safeUser
      });
    }
  );


  // *GET ALL SPOTS OWNED BY THE CURRENT USER*
  router.get('/spots', requireAuth, async (req, res) => {
    const userId = req.user.id;
    const spots = await Spot.findAll({
        where: { ownerId: userId },
        include: [
          {
            model: Review,
            attributes: []
          }
        ],
        attributes: {
          include: [
            [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgRating']
          ]
        },
        group: ['Spot.id']
      });

      return res.json({ Spots: spots });

  });


// *GET ALL REVIEWS OF THE CURRENT USER*
router.get('/reviews', requireAuth, async (req, res) => {
    const userId = req.user.id;
    const reviews = await Review.findAll({
      where: { userId },
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'email', 'username'],
        },
        {
          model: Image,
          as: 'ReviewImages',
          attributes: ['url', 'preview'],
        },
        {
          model: Spot,
          include: [
            {
              model: Image,
              as: 'SpotImages',
              attributes: ['url', 'preview'],
            },
          ],
        },

      ],
    });
    return res.json({ Reviews: reviews });
});


// *GET ALL OF CURRENT USER'S BOOKINGS*
router.get('/bookings', requireAuth, async (req, res) => {
  const userId = req.user.id;

  // Bookings for Current User
  const bookings = await Booking.findAll({
    where: { userId },
    include: [
      {
        model: Spot,
        attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price', 'previewImage'],
      },
    ],
  });

  return res.json({ Bookings: bookings });
});

module.exports = router;
