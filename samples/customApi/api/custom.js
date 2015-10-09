var middleware = require('customMiddleware');

var api = module.exports = {
    get: [customMiddleware, function (req, res, next) {
        next()
    }],
    post: [customMiddleware, function (req, res, next) {
        next()
    }]
}

api.get.authorize = true;
