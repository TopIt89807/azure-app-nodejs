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
                        log.silly('Authentication succeeded: ' + user.id);
                        req.azureMobile = req.azureMobile || {};
                        req.azureMobile.user = user;
                        next();
                    })
                    .catch(function (error) {
                        log.silly('Authentication failed: ' + error.message);
                        res.status(401).send(error);
                    });
            } else {
                next();
            }
        };
    } else {
        return function (req, res, next) {
            next();
        };
    }
};
