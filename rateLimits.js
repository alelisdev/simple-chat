// too many request response message
const message = 'Too many accounts created from this IP, please try again after a minute';
// retry after / minutes
const mins = 1;

const rateLimit = require('express-rate-limit');

const rateLimiter = (app) => {
    const imgLimter = rateLimit({
        windowMs: 60 * 1000, // 1 minutes
        max: 40,
        message: message
    });
    
    
    const distLimter = rateLimit({
        windowMs: mins*60 * 1000, // 1 minutes
        max: 40,
        message: message
    });
    
    const mediaLimter = rateLimit({
        windowMs: 60 * 1000, // 1 minutes
        max: 40
    });
    
    const staticLimter = rateLimit({
        windowMs: 60 * 1000, // 1 minutes
        max: 40,
        message: message
    });

    app.use('/img/', imgLimter);
    app.use('/static/', staticLimter);
    app.use('/media/', mediaLimter);
    app.use('/dist/', distLimter);

}





module.exports = rateLimiter;