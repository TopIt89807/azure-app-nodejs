// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
module.exports = function(configuration) {
    return function (req, res, next) {
        if(configuration.version) {
            res.set('x-zumo-server-version', configuration.version);
        }
        next();
    };
};
