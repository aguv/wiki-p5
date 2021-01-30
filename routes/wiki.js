const router = require('express').Router();
const Page = require('../models/Page');
const User = require('../models/User');

router.get('/testing', async (req, res) => {
    const pages = await Page.findAll();
    res.json(pages)
});

router.get('/searchByTag', async (req, res) => {
    const tags = req.query.tags.split(' ');
    try {
        const pages = await Page.findByTag(tags);
        res.render('index', { pages });
    } catch (e) {
        console.log(e);
    }
});

router.get('/search', (req, res) => {
    res.render('search');
});

router.get('/add', (req, res) => {
    res.render('addpage');
});


router.get('/:urlTitle/edit', async (req, res) => {
    try { 
        const page = await Page.findOne({ where: { urlTitle: req.params.urlTitle }});
        console.log(page);
        res.render('edituser', { page });
    } catch (e) {
        console.log(e);
    }
});

router.post('/:urlTitle/edit', async (req, res) => {
    try {
        let page = await Page.findOne({ where: { urlTitle: req.params.urlTitle } });

        for(let key in req.body) {
            page[key] = req.body[key];
        }

        page = await page.save();
        res.redirect(page.route);

    } catch (e) {
        console.log(e)
    }
});

router.get('/:urlTitle', async (req, res) => {
    let page;
    try {
        page = await Page.findOne({
                        where: {
                            urlTitle: req.params.urlTitle
                        },
                        include: [
                            {model: User, as: 'author'}
                        ]
                    });
        
        if(page === null) {
            res.status(404).send();
        } else {
            page.tags = page.tags.join(' ');
            res.render('wikipage', { page });
        }
    } catch (e) {
        console.log(e);
    }
});


router.post('/', async (req, res) => {
    const {author, email, title, content} = req.body
    let tags = req.body.tags.split(' ');

    try {
        let user = await User.findOrCreate({
                                where: {
                                    author,
                                    email
                                    }
                                });

        user = user[0];

        const page = await Page.create({
                                    title,
                                    content,
                                    tags
                                }); 

        page.setAuthor(user);
        console.log(page);
        res.redirect(page.route);

    } catch (e) {
        console.log(e);
    }
});

router.get('/:urlTitle/similar', async (req, res) => {
    try {
        const page = await Page.findOne({ where: { urlTitle: req.params.urlTitle } })
        const similarPages = await page.findBySimilar();
        res.render('index', { pages: similarPages });
    } catch (e) {
        console.log(e);
    }
});

router.get('/:urlTitle/delete', async (req, res) => {
    try {
        const page = await Page.destroy({ where: { urlTitle: req.params.urlTitle } });
        res.redirect('/wiki');
    } catch (e) {
        console.log(e);
    }
});

router.get('/', (req, res) => {
    res.redirect('/')
});


module.exports = router;
