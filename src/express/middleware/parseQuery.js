// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var queries = require('../../query'),
    errors = require('../../utilities/errors');

// parse OData query from querystring into queryjs query object and attach to request object
module.exports = function (table) {
    return function (req, res, next) {
        var context = req.azureMobile;

        context.table = table;

        if(req.params.id) {
            context.id = req.params.id;
            context.query = queries.create(table.name).where({ id: context.id });
            context.query.id = context.id;
            context.query.single = true;
        } else {
            enforceMaxTop();
            context.query = queries.fromRequest(req);
        }

        if(req.query.__includeDeleted)
            context.query.includeDeleted = true;

        var etag = req.get('if-match');
        if(etag) {
            context.version = etag;
            context.query.where({ version: etag });
            context.query.version = etag;
        }

        // set take to the min of $top and pageSize, can be overridden in server middleware
        context.query = context.query.take(Math.min(table.pageSize, req.query.$top));

        next();

        function enforceMaxTop() {
            if(table.maxTop) {
                var top = req.query.$top;

                if(top > table.maxTop)
                    throw errors.badRequest("You cannot request more than " + table.maxTop + " records");

                if(!top)
                    req.query.$top = table.maxTop
            }
        }
    };
};
