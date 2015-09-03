// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var express = require('express'),
    bodyParser = require('body-parser'),
    notifications = require('../../notifications'),
    log = require('../../logger');

module.exports = function (configuration) {
    router = express.Router();
    
    if (configuration && configuration.notifications && Object.keys(configuration.notifications).length > 0) {
        var notifactionPath = configuration.notificationRootPath || '/push/installations';

        var installationClient = notifications(configuration.notifications);

        var addPushContext = function (req, res, next) {
            req.azureMobile = req.azureMobile || {};
            req.azureMobile.push = installationClient.getClient();
            next();
        };

        var put = function(req, res, next) {
            var installationId = req.params.installationId,
                installation = req.body,
                user = req.azureMobile.user;

            installationClient.putInstallation(installationId, installation, user)
                .then(function (result) {
                    res.status(204).end();
                })
                .catch(next);
        };

        var del = function(req, res, next) {
            var installationId = req.params.installationId;

            installationClient.deleteInstallation(installationId)
                .then(function (result) {
                    res.status(204).end();
                })
                .catch(next);
        }

        var errorHandler = function(err, req, res, next) {
            log.error(err);
            res.status(400).send(err.message || 'Bad Request');
        }

        var reviver = function(key, val) {
            // strip all tags from installation object
            if (key.toLowerCase() !== 'tags')
                return val;
        }

        router.use(addPushContext);
        router.route(notifactionPath + '/:installationId')
            .put(bodyParser.json({ reviver: reviver }), put, errorHandler)
            .delete(del, errorHandler);
    }

    return router;
}