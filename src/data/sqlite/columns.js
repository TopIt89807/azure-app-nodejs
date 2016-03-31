var execute = require('./execute'),
    statements = require('./statements'),
    helpers = require('./helpers'),
    promises = require('../../utilities/promises'),
    queries = require('../../query'),

    typesTable = { name: '__types' };

module.exports = function (configuration) {
    var tables = {};
    configuration = configuration || {};

    return {
        for: function (table) {
            if(tables[table.name])
                return promises.resolved(tables[table.name]);
            return get(table);
        },
        set: set
    };

    function get(table) {
        var query = queries.create(typesTable.name).select('name', 'type').where({ table: table.name });
        return execute(configuration, statements.read(query, typesTable))
            .catch(function (error) {
                // nothing has been inserted for this table, we're going to return an empty array of results later anyway
                return [];
            });
    }

    function set(table, item) {
        var setStatements = statements.setColumns(table, item);
        return execute(configuration, setStatements)
            .catch(function (error) {
                return initialize(table).then(function () {
                    // if we fail this time, we're borked
                    return execute(configuration, setStatements);
                });
            });
    }

    function initialize(table) {
        return execute(configuration, statements.createColumnsTable(table));
    }
};
