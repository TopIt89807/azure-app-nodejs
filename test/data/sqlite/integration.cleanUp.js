var execute = require('../../../src/data/sqlite/execute');

module.exports = function (data, table) {
    table.sqliteColumns = undefined;

    return data.execute({ sql: 'DROP TABLE __types' })
        .then(function () {
            return data.execute({ sql: 'DROP TABLE ' + table.name });
        })
        .then(function () {})
        .catch(function () {});
};
