// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var errors = require('../../utilities/errors'),
    log = require('../../logger');

﻿// render results attached to response object to the client in JSON format
module.exports = function (configuration) {
    return function (req, res, next) {
        preventCaching();

        if(res.results) {
            res.json(res.results);
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
    };
};
