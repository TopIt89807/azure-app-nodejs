var api = module.exports = {
    get: function (req, res, next) {
        res.status(200).end();
    },
    delete: function(req, res, next) {
        res.status(200).end();
    }
};

api.authorise = true;
