// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
// translate the queryjs Query object into the odata format that our formatter expects
var queries = require('../../../query'),
    format = require('../query/format');

module.exports = function (source, tableConfig) {
    var query = queries.toOData(source);

    // copy custom properties from the source query. this is NOT ideal!
    query.includeDeleted = source.includeDeleted;

    return format(query, tableConfig);
}
