// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var statements = require('./statements'),
    execute = require('./execute'),
    dynamicSchema = require('./dynamicSchema'),
    schema = require('./schema'),
    columnsModule = require('./columns'),
    assert = require('../../utilities/assert').argument,
    promises = require('../../utilities/promises'),
    queries = require('../../query'),
    uuid = require('node-uuid');

module.exports = function (configuration) {
    configuration = configuration || {};
    var columns = columnsModule(configuration);

    var tableAccess = function (table) {
        assert(table, 'A table was not specified');

        // set execute functions based on dynamic schema and operation
        var read, update, insert, del;
        if (table.dynamicSchema !== false) {
            read = dynamicSchema(table).read;
            update = insert = del = dynamicSchema(table).execute;
        } else {
            read = update = insert = del = execute;
        }

        return {
            read: function (query) {
                return loadColumns().then(function () {
                    query = query || queries.create(table.name);
                    return read(configuration, statements.read(query, table));
                });
            },
            update: function (item, query) {
                assert(item, 'An item to update was not provided');
                return loadColumns().then(function () {
                    return update(configuration, statements.update(table, item, query), item);
                });
            },
            insert: function (item) {
                assert(item, 'An item to insert was not provided');
                return loadColumns().then(function () {
                    item.id = item.id || uuid.v4();
                    return insert(configuration, statements.insert(table, item), item);
                });
            },
            delete: function (query, version) {
                assert(query, 'The delete query was not provided');
                return loadColumns().then(function () {
                    return del(configuration, statements.delete(table, query, version));
                });
            },
            undelete: function (query, version) {
                assert(query, 'The undelete query was not provided');
                return loadColumns().then(function () {
                    return del(configuration, statements.undelete(table, query, version));
                });
            },
            truncate: function () {
                return execute(configuration, statements.truncate(table));
            },
            initialize: function () {
                return schema(configuration).initialize(table);
            },
            schema: function () {
                return schema(configuration).get(table);
            }
        };

        function loadColumns() {
            if(!table.sqliteColumns)
                return columns.for(table);
            return promises.resolved();
        }
    };

    // expose a method to allow direct execution of SQL queries
    tableAccess.execute = function (statement) {
        assert(statement, 'A SQL statement was not provided');
        return execute(configuration, statement);
    };

    return tableAccess;
};
