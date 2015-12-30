// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var errors = require('../../utilities/errors'),
    log = require('../../logger');

﻿// render results attached to response object to the client in JSON format
module.exports = function (req, res, next) {
    preventCaching();

    if(res.results) {
        // if we were issued a query for a single result (i.e. query by id), return a single result
        if(req.azureMobile.query && req.azureMobile.query.single) {
            // user code can say context.execute().then() and return a single object - return that here
            if(res.results.constructor !== Array) {
                res.json(res.results);
            } else if(res.results.length > 0) {
                res.json(res.results[0]);
            } else {
                next(errors.notFound());
            }
        } else {
            res.json(res.results);
        }
    } else
        next(errors.notFound());

    function preventCaching() {
        // this is very nasty, but the simplest way I can find to circumvent the default express/fresh behaviour for 304s
        req.headers['if-modified-since'] = undefined;
        req.headers['if-none-match'] = undefined;
        res.set('cache-control', 'no-cache');
        res.set('expires', 0);
        res.set('pragma', 'no-cache');
    }
}
