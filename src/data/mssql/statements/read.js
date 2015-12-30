// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var queries = require('../../../query'),
    format = require('../query/format');

module.exports = function (source, tableConfig) {
    // translate the queryjs Query object into the odata format that our formatter expects
    var query = queries.toOData(source);

    // copy custom properties from the source query. this is NOT ideal!
    query.includeDeleted = source.includeDeleted;

    return combineStatements(format(query, tableConfig));
};

function combineStatements(statements) {
    return statements.reduce(function(target, statement) {
        target.sql += statement.sql + '; ';

        if (statement.parameters)
            target.parameters = target.parameters.concat(statement.parameters);

        return target;
    }, { sql: '', parameters: [], multiple: true });
}
