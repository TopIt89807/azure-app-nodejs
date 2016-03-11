// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var data = require('../../data'),
    notifications = require('../../notifications'),
    attachOperators = require('../../query/attachOperators'),
    logger = require('../../logger');

module.exports = function (configuration) {
    var dataProvider = data(configuration),
        notificationsClient = notifications(configuration.notifications).getClient();

    return function (req, res, next) {
        req.azureMobile = {
            req: req,
            res: res,
            data: dataProvider,
            push: notificationsClient,
            configuration: configuration,
            logger: logger,
            tables: function (name) {
                if(!configuration.tables[name])
                    throw new Error("The table '" + name + "' does not exist.")
                return attachOperators(name, dataProvider(configuration.tables[name]));
            }
        };
        next();
    };
};
