const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('./server/routes/routes');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session)
//Promise mongoose and connect to mongodb
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/testapp', {
    useMongoClient: true
});
//test connection to mongodb
mongoose.connection.once('open', () => {
    console.log('Success to connect');
});
mongoose.connection.on('error', (err) => {
    console.log(err);
});

//Setup views 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'server/views'));
app.use(express.static(path.join(__dirname, 'server/public')));



//Use bodyparser middleware
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: 'work hard',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({ url: 'mongodb://localhost/testapp' })
}));
app.use(flash());
app.use(function(req, res, next){
    res.locals.success = req.flash('success');
    res.locals.errors = req.flash('error');
    next();
});
routes(app);

module.exports = app;