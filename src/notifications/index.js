// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
/**
@module azure-mobile-apps/notifications
@description Functions for managing notification installations and the NH client
*/
var util = require('util'),
    promises = require('../utilities/promises'),
    NotificationHubService = require('azure-sb').NotificationHubService,
    InstallationIdTag = "$InstallationId:{%s}",
    UserIdTagPrefix = "_UserId:";

/**
 * @param  {notificationsConfiguration} configuration The notifications configuration
 * @return An object with members described below
 */
module.exports = function (configuration) {
    var nhClient = new NotificationHubService(configuration.hubName, configuration.connectionString 
        || configuration.endpoint, configuration.sharedAccessKeyName, configuration.sharedAccessKeyValue);

    return {
        /**
         * Returns an instance of the Notification Hubs Client for Node
         * @return {object} notificationsClient The Notification Hubs node client
         */
        getClient: function () { return nhClient; },

        /**
         * Creates or updates the installation id with the supplied installation
         * @param  {string} installationId The installation id, usually a guid
         * @param  {object} installation The notification hubs installation object
         * @param  {string} [user] The user id to associate with the installation 
         * @return A promise that yields the notification hubs client response
         */
        putInstallation: function (installationId, installation, user) {
            installation.installationId = installationId;
            return getTagsByInstallationId(installationId)
                .then(function (tags) {
                    installation.tags = addUserTag(tags, user);
                    return promises.create(function (result, reject) {
                        nhClient.createOrUpdateInstallation(installation, function (err, res) {
                            if (err) {
                                reject(err);
                            } else {
                                result(res);
                            }
                        });
                    });                
                });
        },

        /**
         * Deletes the installation specified by the installation id
         * @param  {string} installationId The installation id, usually a guid
         * @return A promise that yields the notification hubs client response
         */
        deleteInstallation: function (installationId) {
            return promises.create(function (result, reject) {
                nhClient.deleteInstallation(installationId, function (err, res) {
                    if (err) {
                        return reject(err);
                    } else {
                        return result(res);
                    }
                });
            });
        }
    };

    function getTagsByInstallationId(installationId) {
        var installationIdAsTag = util.format(InstallationIdTag, installationId);
        
        return mapRegistrations(installationIdAsTag, function (registration) { return registration.Tag });
    }

    function addUserTag(tags, user) {
        if (user) {
            tags = tags.filter(function (tag) {
                return !(tag.indexOf(UserIdTagPrefix) === 0);
            });
            tags.push(UserIdTagPrefix + user);
        }
        return tags;
    }

    function mapRegistrations(tag, mapFunc) {
        var mapFunction = mapFunc;

        return promises.create(function (result, reject) {
            var mapFunc = mapFunc || function (registration) { return registration; };
            var results = [];
            // nh limits to 100 registrations per call
            listRegistrations(100, 0);

            function listRegistrations(top, skip) {
                nhClient.listRegistrationsByTag(tag, { top: top, skip: skip }, function (err, res) {
                    if (err) {
                        reject(err);
                    } else if (res.length === 0) {
                        result(results);
                    } else {
                        results = results.concat(res.map(mapFunction));
                        listRegistrations(top, skip + top);
                    }
                });
            }
        });
    }
}