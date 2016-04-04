var execute = require('../../../src/data/sqlite/execute');

module.exports = function (config, table) {
    return execute(config, { sql: 'DROP TABLE ' + table.name })
        .then(function () {
            return execute(config, { sql: 'DROP TABLE __types' });
        })
        .then(function () {})
        .catch(function () {});
};
