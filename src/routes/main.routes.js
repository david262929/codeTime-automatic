const {Router} = require('express');
// const {check, validationResult} = require('express-validator')

// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const config = require('config');

const router = Router();

const auth = require('../middleware/auth.middleware')

// /api/auth/register

// router.get('/login', auth, )

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
    // await scrapper({url : `http://newslentalj.com/vit2/feroctilfree/vsemir/`})
    // res.render("image", { url: file.path, name: file.filename, ext: ext })
})



router.get("/automatic", async (req, res) => {
    console.log(req._parsedUrl.pathname)
    // res.render("main",  {
    //     data : {
    //         navbar : generateNavbarData(req._parsedUrl.pathname)
    //     }
    // });
    // res.render("automatic");
    // await scrapper({url : `http://newslentalj.com/vit2/feroctilfree/vsemir/`})
    // res.render("image", { url: file.path, name: file.filename, ext: ext })
})


module.exports = router;