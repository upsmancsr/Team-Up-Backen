const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const configVars = require('../../config/configVars');

// Import req validation functions:
const validateSignUpInput = require('../../reqValidation/validateSignUp');
const validateSignInInput = require('../../reqValidation/validateSignIn');

// Import User model for db:
const User = require('../../schemas/User');

// POST endpoint to sign up a new user:
router.post('/signup', (req, res) => {
    // Run the req.body through the validateSignUpInput function
    // and get any errors and isValid boolean the function returns:
    const { errors, isValid } = validateSignUpInput(req.body);

    // If validate function returns false for isValid, return a status 400 response:
    if (!isValid) {
        return res.status(400).json(errors);
    }

    // Use the .findOne method from MongoDB 
    // (available through the User model, which utilizes mongoose and mongoose.schema)
    // to check if user already exists:
    User.findOne({ email: req.body.email }).then(user => {
        // If user is already in db, return a status 400 response,
        // otherwise create a new User object:
        if (user) {
            return res.status(400).json({ email: 'Email already exists' });
        } else {
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            });

            // Hash the input password using bcrypt, 
            // and replace newUser.password with hashed password:
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                
                // save newUser in db using MongoDB .save() method,
                // and send appropriate response:
                newUser
                    .save()
                    .then(user => res.json(user))
                    .catch(err => console.log(err));
                });
            });
        }
    });
});

// POST endpoint to sign in a user after authenticating credentials'
router.post('/signin', (req, res) => {
    // Run the req.body through the validateSignUpInput function
    // and get any errors and isValid boolean the function returns:
    const { errors, isValid } = validateSignInInput(req.body);

    // If validate function returns false for isValid, return a status 400 response:
    if (!isValid) {
        return res.status(400).json(errors);
    }

    // Pull email and password from req.body:
    const email = req.body.email;
    const password = req.body.password;

    // Use the .findOne method from MongoDB 
    // (available through the User model, which utilizes mongoose and mongoose.schema)
    // to check if user already exists:
    User.findOne({ email }).then(user => {
        // If user does not exist, return a status 404 response,
        if (!user) {
            return res.status(404).json({ emailnotfound: 'Email not found' });
        }

        // Use bcrypt to compare input password to saved user password:
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                // Create the JWT Payload:
                const payload = {
                    id: user.id,
                    name: user.name
                };

                // Sign the JWT:
                jwt.sign(
                    payload,
                    configVars.secretOrKey,
                    {
                        expiresIn: 31556926 // 1 year in seconds
                    },
                    (error, token) => {
                        res.json({
                            success: true,
                            token: 'Bearer ' + token
                        });
                    }
                );
            } else {        
                // not a match, return 400 response:
                return res.status(400).json({ passwordincorrect: 'Password incorrect' });
            }
        });
    });
});

// GET endpoint to get all users:
// Uses passport as authentication middleware:
router.get('/allusers', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const users = await User.find({}).select('name email');
        res.status(200).json(users);
    }
    catch(error) {
        res.status(500).json(error);
    }
});

router.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/', session: false }),
    function(req, res) {
        var token = req.user.token;
        res.redirect('http://localhost:3000?token=' + token);
    }
);

module.exports = router;