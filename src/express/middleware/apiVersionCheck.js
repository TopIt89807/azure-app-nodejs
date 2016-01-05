// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var errors = require('../../utilities/errors'),
    acceptedVersionRegex = /^2[.]0[.]\d+$/,
    acceptedVersion = '2.0.0';

module.exports = function (configuration) {
    return function (req, res, next) {
        if(!configuration.skipVersionCheck && req.method.toUpperCase() !== 'OPTIONS') {
            var apiVersion = req.get('zumo-api-version') || req.query['zumo-api-version'];
            if(!apiVersion || !apiVersion.match(acceptedVersionRegex))
                next(errors.badRequest('An invalid API version was specified in the request, this request needs to specify a ZUMO-API-VERSION of ' + acceptedVersion + '.'));
        }
        next();
    };
};
