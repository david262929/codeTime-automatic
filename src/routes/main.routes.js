const {Router} = require('express');
const path = require('path');
const fs = require('fs');
// const {check, validationResult} = require('express-validator')

// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const config = require('config');

const router = Router();

const auth = require('../middleware/auth.middleware')

const generateNavbarData = (active = '/') => {
    const data = {
        active,
        buttons : [
            {
                text : 'Home',
                href : '/',
            },
            {
                text : 'Documentation',
                href : '/automatic/documentation',
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
    }
    return data;
}

const generateMarkdownHTML = () => {
    const md = require('markdown-it')();
    const readmePathName = path.resolve('README.md');
    const readmeContent = fs.readFileSync(readmePathName , {"encoding": "utf8", "flag": "r"} )
    return md.render( readmeContent );
}

router.get('/',  async (req, res) => {
    res.render("main",  {
        components : [
            {
                viewPathName : 'components/navbar',
                data : generateNavbarData(req._parsedUrl.pathname)
            },
            {
                viewPathName : 'pages/automatic',
                data : 'davo_ davo _davo'
            }
        ]
    });
})



router.get("/automatic/documentation", async (req, res) => {
    res.render("main",  {
        components : [
            {
                viewPathName : 'components/navbar',
                data : generateNavbarData(req._parsedUrl.pathname)
            },
            {
                viewPathName : 'pages/automaticDocumentation',
                data : generateMarkdownHTML()
            }
        ]
    });
})

router.get("/login", async (req, res) => {
    res.render("main",  {
        components : [
            {
                viewPathName : 'components/navbar',
                data : generateNavbarData(req._parsedUrl.pathname)
            },
            {
                viewPathName : 'pages/login',
                data : 'davo_ davo _davo'
            }
        ]
    });
})

router.get("/register", async (req, res) => {
    res.render("main",  {
        components : [
            {
                viewPathName : 'components/navbar',
                data : generateNavbarData(req._parsedUrl.pathname)
            },
            {
                viewPathName : 'pages/register',
                data : 'davo_ davo _davo'
            }
        ]
    });
})


module.exports = router;
