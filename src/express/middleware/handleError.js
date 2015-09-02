// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var log = require('../../logger');

module.exports = function (configuration) {
    return function (err, req, res, next) {
        if(err.concurrency)
            if(err.item) {
                res.status(req.get('if-match') ? 412 : 409).json(err.item);
            } else {
                res.status(404).end();
            }
        else if (err.duplicate)
            res.status(409).json(req.azureMobile.item);
        else {
            log.error(err);
            res.status(500).json(normaliseError(err));
        }
    };

    function normaliseError(err) {
        if(!configuration.debug)
            return;

        if(!err)
            return {
                message: 'Unknown error'
            };

        if(err instanceof Error)
            return {
                message: err.message,
                stack: err.stack
            };

        if(err.constructor === String)
            return {
                message: err
            };

        return err;
    }
}
