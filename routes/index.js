const router = require('express').Router();
const wikiRouter = require('./wiki');
const userRouter = require('./user');
const Page = require('../models/Page');
const User = require('../models/User');

router.use('/wiki', wikiRouter);
router.use('/users', userRouter);

router.get('/', async (req, res) => {
    try {
        const pages = await Page.findAll();
        res.render('index', { pages });
    } catch (e) {
        console.log(e);
    }
});


module.exports = router;
