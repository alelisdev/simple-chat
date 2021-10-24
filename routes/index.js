var express = require('express'),
    router = express.Router(),
    session = require('express-session');

router.use(session({
    secret: 'index route secret',
    resave: false,
    saveUninitialized: true
}));

module.exports = router;