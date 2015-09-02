// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------

﻿// render results attached to response object to the client in JSON format
module.exports = function (req, res, next) {
    if(res.results) {
        // if we were issued a query for a single result (i.e. query by id), return a single result
        if(req.azureMobile.query && req.azureMobile.query.single) {
            // if we were returned a single object by custom user code, return that here
            if(res.results.constructor !== Array) {
                if(res.results.recordsAffected === undefined || res.results.recordsAffected > 0)
                    res.status(200).json(res.results);
                else
                    res.status(404).end();
            } else if(res.results.length > 0) {
                addETag(res.results[0]);
                res.status(200).json(res.results[0]);
            } else {
                res.status(404).end();
            }
        } else {
            if(res.recordsAffected === 0)
                res.status(404).end();
            else
                addETag(res.results);
                res.status(200).json(res.results);
        }
    } else
        res.status(404).end();

    function addETag(item) {
        res.set('ETag', '"' + item.__version + '"');
    }
}
