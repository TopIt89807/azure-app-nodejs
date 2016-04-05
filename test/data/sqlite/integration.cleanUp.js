var execute = require('../../../src/data/sqlite/execute');

module.exports = function (config, table) {
    table.sqliteColumns = undefined;
    
    return execute(config, { sql: 'DROP TABLE __types' })
        .then(function () {
            return execute(config, { sql: 'DROP TABLE ' + table.name });
        })
        .then(function () {})
        .catch(function () {});
};
