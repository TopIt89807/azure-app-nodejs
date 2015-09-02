// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var express = require('express'),
    bodyParser = require('body-parser'),
    notifications = require('../../notifications'),
    log = require('../../logger');

module.exports = function (configuration) {
    if (configuration && configuration.notifications && Object.keys(configuration.notifications).length > 0) {
        var notifactionPath = configuration.notificationRootPath || '/push/installations',
            router = express.Router();

        router.use(addPushContext);
        router.route(notifactionPath + '/:installationId')
            .put(bodyParser.json({ reviver: reviver }), put, errorHandler)
            .delete(del, errorHandler);
        return router;

        var installationClient = notifications(configuration.notifications);

        function addPushContext(req, res, next) {
            req.azureMobile.push = installationClient.nhClient;
        }

        function put(req, res, next) {
            var installationId = req.params.installationId,
                installation = req.body,
                user = req.azureMobile.user;

            installationClient.createOrUpdateInstallation(installationId, installation, user)
                .then(function (result) {
                    res.status(204).end();
                })
                .catch(next);
        }

        function del(req, res, next) {
            installationClient.deleteInstallation(installationId)
                .then(function (result) {
                    res.status(204).end();
                })
                .catch(next);
        }

        function errorHandler(err, req, res, next) {
            log.error(err);
            res.status(400).send(err.message || 'Bad Request');
        }

        function reviver(key, val) {
            // strip all tags from installation object
            if (key.toLowerCase() !== 'tags')
                return val;
        }
    } else {
        return function(req, res, next) {
            next();
        }
    }
}