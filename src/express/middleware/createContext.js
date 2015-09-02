// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var data = require('../../data'),
    attachOperators = require('../../query/attachOperators');

module.exports = function (configuration) {
    var provider = data(configuration);

    return function (req, res, next) {
        req.azureMobile = {
            req: req,
            res: res,
            data: provider,
            tables: function (name) {
                return attachOperators(name, provider(configuration.tables[name]));
            }
        };
        next();
    };
};
