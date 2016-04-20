// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
/**
@module azure-mobile-apps/src/express/middleware/authenticate
@description Validates JWT tokens provided in an HTTP request header called
x-zumo-auth. If tokens are valid, a {@link module:azure-mobile-apps/src/auth/user user object}
is attached to the request.azureMobile property. If tokens are invalid, a HTTP
status of 401 is returned to the client.
*/
var auth = require('../../auth');

/**
Create a new instance of the authenticate middleware
@param {configuration} configuration The mobile app configuration
*/
module.exports = function (configuration) {
    if(configuration && configuration.auth && Object.keys(configuration.auth).length > 0) {
        var authUtils = auth(configuration.auth);

        return function (req, res, next) {
            var token = req.get('x-zumo-auth');

            if(token) {
                req.azureMobile = req.azureMobile || {};
                req.azureMobile.auth = authUtils;

                if(configuration.auth.validateTokens === true || !configuration.hosted) {
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
