// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
module.exports = function (configuration) {
    return function (req, res, next) {
        if(req.get('origin'))
            res.set('access-control-expose-headers', configuration.cors.exposeHeaders);
        next();
    };
};
