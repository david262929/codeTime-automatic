const {Router} = require('express');
const {check, validationResult} = require('express-validator')

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../models/User');
const router = Router();

const auth = require('../middleware/auth.middleware')

// /api/auth/register
router.get('/login', auth)

router.post(
    '/register',
    [
        check('email', 'Not correct email.').isEmail(),
        check('password', 'Min length of password 6 symbols.').isLength({min: 6}),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if ( !errors.isEmpty() ) {
                return res.status(200).json({
                    errors : errors.array(),
                    message: 'Not correct data per register.'
                });
            }

            const {email, password} = req.body;

            const candidate = await User.findOne({email});

            if ( candidate ) {
                return res.status(200).json({message: 'User with that email already exists.'});
            }

            const hashedPassword = await bcrypt.hash(password, 12);

            const newUser = new User({email, password: hashedPassword});

            await newUser.save();

            res.status(201).json({message: 'User created.'});
            // User.

        } catch (e) {
            console.log('Server error Davo jan... /api/auth/register ...', e.message, e);
            res.status(500).json({message: 'Something went wrong'});
        }
    }
);

// /api/auth/login
router.post(
    '/login',
    [
        check('email', 'Not correct email.').normalizeEmail().isEmail(),
        check('password', 'Min length of password 6 symbols.').exists().isLength({min: 6}),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if ( !errors.isEmpty() ) {
                return res.status(400).json({
                    errors : errors.array(),
                    message: 'Not correct data per login.'
                });
            }

            const {email, password} = req.body;

            const currentUser = await User.findOne({email});

            if (!currentUser) {
                return res.status(200).json({message: `Can't find User with that email.`});
            }

            const isMatch = await bcrypt.compare(password, currentUser.password);

            if(!isMatch) {
                return res.status(200).json({message: 'Wrong credentials.'});
            }
            const userId = currentUser._id;

            const token = jwt.sign(
                { userId },
                config.get('jwtSecret'),
                {expiresIn : '1h'}
            );

            res.status(200).json({
                userId,
                token,
                message: 'Successfully logged In.',
            });


        } catch (e) {
            console.log('Server error Davo jan... /api/auth/login ...', e.message, e);
            res.status(500).json({message: 'Something went wrong'});
        }
    }
);

module.exports = router;