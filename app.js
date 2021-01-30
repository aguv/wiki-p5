const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const router = require('./routes/index');
const sequelize = require('./db');

//
const app = express();

//app.use(express.static('./public'))



app.use(express.static('./public'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('tiny'));

const env = nunjucks.configure('views', {noCache: true});
app.set('view engine', 'html');
app.engine('html', nunjucks.render);


app.use(router);

//
const PORT = 3000;

// si necesito el force true lo hago adentro de sync (para vaciar la base de datos)
sequelize.sync()    
    .then(() => {
        console.log('Sequelize on');
        app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
    })
    .catch(err => console.log(err));

