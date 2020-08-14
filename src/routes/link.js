const {Router} = require('express')
const config = require('config')
const shortid = require('shortid')
const auth = require('../functions/middleware/auth.middleware')
const Link = require('../models/Link')
const router = Router()

router.post('/generate', auth, async (req, res) => {
    try {
        const baseUrl = config.get('baseUrl')
        const {from} = req.body

        const existing = await Link.findOne({from});
        if (existing) {
            res.json({link: existing})
        }

        const code = shortid.generate()
        const to = `${baseUrl}/t/${code}`

        const link = new Link({
            code, to, from, owner: req.user.userId
        })

        await Link.save()

        res.status(201).json({
            message: "You have successfully shorted a link",
            link,
        })

    } catch (e) {
        console.log('Server error Davo jan... /api/auth/fenerate ...', e.message, e)
        res.status(500).json({message: 'Something went wrong'})
    }
});

router.get('/', auth, async (req, res) => {
    try {
        const links = await Link.find({owner: req.user.userId})
        res.json(links)


    } catch (e) {
        console.log('Server error Davo jan... /api/auth/register ...', e.message, e)
        res.status(500).json({message: 'Something went wrong'})
    }
});

router.get('/:id', auth, async (req, res) => {
    try {
        const links = await Link.findById(req.params.id)
        res.json(links)


    } catch (e) {
        console.log('Server error Davo jan... /api/auth/register ...', e.message, e)
        res.status(500).json({message: 'Something went wrong'})
    }
});

module.exports = router;