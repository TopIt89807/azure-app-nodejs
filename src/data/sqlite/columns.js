var execute = require('./execute'),
    statements = require('./statements'),
    promises = require('../../../utilities/promises'),
    queries = require('../../../query'),

    typesTable = { name: '__types' },
    tables = {};

module.exports = function (configuration) {
    return {
        for: function (table) {
            if(tables[table.name])
                return promises.resolved(tables[table.name]);
            return get(table);
        },
        set: function (table, item) {
            set(table, item);
        }
    };

    function get(table) {
        var query = queries.create(typesTable.name).where({ table: table.name });
        return execute(configuration, statements.read(query, typesTable))
            .catch(function (error) {
                return initialize().then(function () {
                    return execute(configuration, statements.read(query, typesTable));
                });
            });
    }

    function set(table, item) {
        var statements = item.map(function (column) {
            statements.insert(typesTable, {
                table: table.name,
                property: '',
                type: ''
            });
        };

        return execute(configuration, statements)
            .catch(function (error) {
                return initialize().then(function () {
                    return execute(configuration, statements)
                });
            });
    }

    function handleError() {

    }
};
