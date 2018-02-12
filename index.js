const express = require('express');
const bodyParser = require('body-parser');
const Sequelize = require('Sequelize');
const db = require('./db/models/index')(Sequelize);

const api = require('./routes/index');

const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/api', api);

app.use(function (req, res, next){
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});


app.use(function (err, req, res, next){
    res.status(err.status || 500);
    res.end(err.message);
});

db.connection.sync({force: true}).then(async () =>{
    await require('./db/insterter')(db.models);
    app.listen(3000, () =>{
        console.log('server listens on port 3000');
    });
});

