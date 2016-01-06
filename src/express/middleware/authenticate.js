// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var auth = require('../../auth'),
    log = require('../../logger'),
    errors = require('../../utilities/errors');

module.exports = function (configuration) {
    if(configuration && configuration.auth && Object.keys(configuration.auth).length > 0) {
        var authUtils = auth(configuration.auth);

        return function (req, res, next) {
            var token = req.get('x-zumo-auth');

            if(token) {
                req.azureMobile = req.azureMobile || {};
                req.azureMobile.auth = authUtils;

                if(configuration.auth.validateTokens) {
                    authUtils.validate(token)
                        .then(function (user) {
                            req.azureMobile.user = user;
                            next();
                        })
                        .catch(function (error) {
                            res.status(401).send(error);
                        });
                } else {
                    try {
                        req.azureMobile.user = authUtils.decode(token);
                        next();
                    } catch(error) {
                        res.status(401).send(error);
                    }
                }
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
