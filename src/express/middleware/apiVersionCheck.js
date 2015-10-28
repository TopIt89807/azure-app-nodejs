// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var acceptedVersionRegex = /^2[.]0[.]\d+$/,
    acceptedVersion = '2.0.0';

module.exports = function (configuration) {
    return function (req, res, next) {
        if(!configuration.skipVersionCheck) {
            var apiVersion = req.get('zumo-api-version') || req.query['zumo-api-version'];
            if(!apiVersion || !apiVersion.match(acceptedVersionRegex))
                next(versionError());
        }
        next();
    };

    function versionError() {
        var error = new Error('An invalid API version was specified in the request, this request needs to specify a ZUMO-API-VERSION of ' + acceptedVersion + '.');
        error.badRequest = true;
        return error;
    }
};
