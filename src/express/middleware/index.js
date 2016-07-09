module.exports = function (configuration) {
    return function (name) {
        return require('./' + name)(configuration);
    };
};

module.exports.tables = function (table) {
    return function (name) {
        return require('./tables/' + name)(table);
    };
};
