var queries = require('../../query');

module.exports = function (table) {
    return function (req, res, next) {
        req.azureMobile.query = queries.create(table.name);
        next();
    };
};
