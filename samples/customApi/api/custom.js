var middleware = require('customMiddleware');

var api = module.exports = require('azure-mobile-apps').api({
    get: [customMiddleware, function (req, res, next) {
        next();
    }],
    post: [customMiddleware, function (req, res, next) {
        next();
    }]
});

api.get.authorize = true;
