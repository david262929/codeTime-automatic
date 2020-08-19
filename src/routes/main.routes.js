const {Router} = require('express');
// const {check, validationResult} = require('express-validator')

// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const config = require('config');

const router = Router();

const auth = require('../middleware/auth.middleware')

const generateNavbarData = (active = '/') => ({
    active,
    buttons : [
        {
            text : 'Home',
            href : '/',
        },
        {
            text : 'Automatic',
            href : '/automatic',
        },
        {
            text : 'Settings',
            href : '/settings',
        },
        {
            text : 'Login',
            href : '/login',
        },
        {
            text : 'Register',
            href : '/register',
        }
    ]
})

router.get('/',  async (req, res) => {
    console.log(req)
    res.render("main",  {
        components : [
            {
                viewPathName : 'components/navbar',
                data : generateNavbarData(req._parsedUrl.pathname)
            },
            {
                viewPathName : 'components/automatic',
                data : 'davo_ davo _davo'
            }
        ]
    });
})



router.get("/automatic", async (req, res) => {
    console.log(req._parsedUrl.pathname)
})


module.exports = router;