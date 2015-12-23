// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var statements = require('./statements'),
    execute = require('./execute'),
    dynamicSchema = require('./dynamicSchema'),
    schema = require('./schema'),
    log = require('../../logger'),
    assert = require('../../utilities/assert').argument,
    promises = require('../../utilities/promises'),
    queries = require('../../query');

module.exports = function (configuration) {
    assert(configuration, 'Data configuration was not provided.');
    assert(configuration.server, 'A database server was not specified.');
    assert(configuration.user, 'A database user was not specified.');
    assert(configuration.password, 'A password for the database user was not specified');

    setEncryption();

    var tableAccess = function (table) {
        assert(table, 'A table was not specified');

        // set execute functions based on dynamic schema and operation
        var read, update, insert;
        if (table.dynamicSchema !== false) {
            read = dynamicSchema(table).read;
            update = insert = dynamicSchema(table).execute;
        } else {
            read = update = insert = execute;
        }

        return {
            read: function (query) {
                query = query || queries.create(table.name);
                return read(configuration, statements.read(query, table)).then(handleReadResult);
            },
            update: function (item) {
                assert(item, 'An item to update was not provided');
                return update(configuration, statements.update(table, item), item).then(returnSingleResultWithConcurrencyCheck);
            },
            insert: function (item) {
                assert(item, 'An item to insert was not provided');
                return insert(configuration, statements.insert(table, item), item).then(returnSingleResult);
            },
            delete: function (id, version) {
                assert(id, 'The ID of an item to delete was not provided');
                return execute(configuration, statements.delete(table, id, version)).then(returnDeleteResults(table));
            },
            undelete: function (id, version) {
                assert(id, 'The ID of an item to undelete was not provided');
                return execute(configuration, statements.undelete(table, id, version)).then(returnSingleResultWithConcurrencyCheck);
            },
            truncate: function () {
                return execute(configuration, statements.truncate(table));
            },
            initialize: function () {
                return schema(configuration).initialize(table);
            }
        };
    };

    // expose a method to allow direct execution if SQL queries
    tableAccess.execute = function (statement) {
        assert(statement, 'A SQL statement was not provided');
        return execute(configuration, statement);
    };

    return tableAccess;

    function handleReadResult(results) {
        log.verbose('Read query returned ' + results[0].length + ' results');
        // reads are multiple result sets to allow for total count as the second query
        if(results.length === 1)
            return translateVersion(results[0]);
        else
            return {
                results: translateVersion(results[0]),
                count: results[1][0].count
            };
    }

    function returnSingleResult(results) {
        return translateVersion(results && results[0]);
    }

    function returnSingleResultWithConcurrencyCheck(results) {
        if(results && results[0][0].recordsAffected === 0) {
            var error = new Error('No records were updated');
            error.concurrency = true;
            error.item = translateVersion(results.length > 1 && results[1] && results[1].length > 0 && results[1][0]);
            throw error;
        }
        return translateVersion(results && results[1] && results[1][0]);
    }

    function translateVersion(items) {
        if(items) {
            if(items.constructor === Array)
                return items.map(translateVersion);

            if(items.version)
                items.version = items.version.toString('base64');

            return items;
        }
    }

    function returnDeleteResults(table) {
        return function (results) {
            if(!table.softDelete && results && results.length === 2) {
                // non-soft delete returns results in opposite order due to select -> delete ordering
                results = [results[1], results[0]];
            }
            return returnSingleResultWithConcurrencyCheck(results);
        }
    }

    function setEncryption() {
        configuration.options = configuration.options || {};
        if(configuration.server.indexOf('database.windows.net') > -1) {
            log.verbose('SQL Azure database detected - setting connection encryption');
            configuration.options.encrypt = true;
        }
    }
};
