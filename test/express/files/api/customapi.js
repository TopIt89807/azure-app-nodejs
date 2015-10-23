var api = module.exports = {
    get: function (req, res, next) {
        res.status(200).end();
    },
    put: [ addHeader, send ],
    delete: function(req, res, next) {
        res.status(200).end();
    },
    trace: function(req, res, next) {
        res.status(500).end();
    },
    post: function (req, res, next) {
        res.status(200).end();
    }
};

api.delete.authorize = true;
// added via json
// api.put.authorize = true;

api.post.disabled = true;

function addHeader(req, res, next) {
    res.set('customapi', 'true');
    next();
}

function send(req, res, next) {
    res.status(200).end();
}