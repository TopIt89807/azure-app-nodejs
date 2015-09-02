// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var auth = require('../../auth'),
    log = require('../../logger');

module.exports = function (configuration) {
    if(configuration && configuration.auth && Object.keys(configuration.auth).length > 0) {
        return function (req, res, next) {
            var token = req.get('x-zumo-auth');

            if(token) {
                var authUtils = auth(configuration.auth);

                req.azureMobile = req.azureMobile || {};
                req.azureMobile.auth = authUtils;

                authUtils.validate(token)
                    .then(function (claims) {
                        req.azureMobile = req.azureMobile || {};
                        req.azureMobile.user = claims;
                        next();
                    })
                    .catch(function (error) {
                        res.status(401).send(error);
                    });
            } else {
                next();
            }
        };
    } else {
        log.warn('Authentication configuration was not specified. Requests will not be authenticated.');
        return function (req, res, next) {
            next();
        };
    }
};
