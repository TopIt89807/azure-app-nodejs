// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var auth = require('../../auth'),
    log = require('../../logger');

module.exports = function (configuration) {
    if(configuration && configuration.auth && Object.keys(configuration.auth).length > 0) {
        var authUtils = auth(configuration.auth);

        return function (req, res, next) {
            var token = req.get('x-zumo-auth');

            if(token) {
                req.azureMobile = req.azureMobile || {};
                req.azureMobile.auth = authUtils;

                authUtils.validate(token)
                    .then(function (user) {
                        req.azureMobile = req.azureMobile || {};
                        req.azureMobile.user = user;
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
        //log.info('Authentication configuration was not specified. Requests will not be authenticated.');
        return function (req, res, next) {
            next();
        };
    }
};
