// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var queries = require('../../query');

// parse OData query from querystring into queryjs query object and attach to request object
module.exports = function (table) {
    return function (req, res, next) {
        var context = req.azureMobile;

        context.table = table;

        if(req.params.id) {
            context.id = req.params.id;
            context.query = queries.create(table.name).where({ id: context.id });
            context.query.single = true;
        } else {
            context.query = queries.fromRequest(req);
        }

        if(req.query.__includeDeleted)
            context.query.includeDeleted = true;

        var etag = req.get('if-match');
        if(etag)
            context.version = etag;

        next();
    };
};
