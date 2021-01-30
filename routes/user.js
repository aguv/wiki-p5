const router = require('express').Router();
const Page = require('../models/Page');
const User = require('../models/User');

//

router.get('/:userId', (req, res) => {
    const userPromise = User.findByPk(req.params.userId);
    const pagesPromise = Page.findAll({
        where: {
          authorId: req.params.userId
        }
    });

    Promise.all([
        userPromise, pagesPromise
    ])
    .then(values => {
        const user = values[0];
        const pages = values[1];
        res.render('user', {user, pages})
    })
    .catch(e => console.log(e));
    
});

router.get('/', async (req, res) => {
    try {
        const users = await User.findAll();
        res.render('users', { users });

    } catch (e) {
        console.log(e);
    }
});


//

module.exports = router;
