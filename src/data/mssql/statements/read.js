// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var queries = require('../../../query'),
    format = require('../query/format'),
    log = require('../../../logger'),
    helpers = require('./helpers');

module.exports = function (source, tableConfig) {
    // translate the queryjs Query object into the odata format that our formatter expects
    var query = queries.toOData(source);

    // copy custom properties from the source query. this is NOT ideal!
    query.includeDeleted = source.includeDeleted;

    return helpers.combineStatements(format(query, tableConfig), transformResult);
};

function transformResult(results) {
    log.silly('Read query returned ' + results[0].length + ' results');

    // if there is more than one result set, total count is the second query
    if(results.length === 1)
        return helpers.translateVersion(results[0]);
    else
        return {
            results: helpers.translateVersion(results[0]),
            count: results[1][0].count
        };
}
