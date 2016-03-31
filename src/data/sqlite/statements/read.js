// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var queries = require('../../../query'),
    format = require('azure-odata-sql').format,
    convert = require('../convert'),
    log = require('../../../logger'),
    helpers = require('../helpers');

module.exports = function (source, tableConfig) {
    // this is not great, affects original object
    tableConfig.flavor = 'sqlite';

    // translate the queryjs Query object into the odata format that our formatter expects
    var query = queries.toOData(source);

    // copy custom properties from the source query. this is NOT ideal!
    query.includeDeleted = source.includeDeleted;

    var statements = format(query, tableConfig);
    statements[0].transform = transformResult;
    statements[0].parameters = helpers.mapParameters(statements[0].parameters);
    return statements.length === 1 ? statements[0] : statements;

    function transformResult(rows) {
        log.silly('Read query returned ' + rows.length + ' results');
        return rows.map(function (row) {
            return convert.item(tableConfig.sqliteColumns, row);
        });

        //var finalResults = results[0];
        //
        // not sure yet......
        // if there is more than one result set, total count is the second query
        // if(results.length > 1)
        //     finalResults.totalCount = results[1][0].count;
        //
        // return finalResults;
    }
};
