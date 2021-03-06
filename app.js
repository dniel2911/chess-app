var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('client-sessions');

// Import Routers
var standard = require('./routes/standard');
var chess = require('./routes/chess');
var login = require('./routes/login');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use(session({
    cookieName: 'session',
    secret: 'QWe23jkjsifowehr890324ujniufnASDkjhwenfkj',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
}));

app.use('/*', function(req, res, next) {
    if (req.session.user) {
        app.locals.username = req.session.user;
    } else {
        app.locals.username = null;
    }

    next();
});


//Routers
app.use('/', standard);
app.use('/chess', chess);
app.use('/user', login);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');

    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
