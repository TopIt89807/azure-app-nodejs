// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var connectionString = require('./connectionString'),
    environment = require('../utilities/environment'),
    assign = require('deeply');

// determine various configuration information from environment such as web.config settings, etc.
module.exports = function (configuration, environment) {
    Object.keys(environment).forEach(function (key) {
        switch(key.toLowerCase()) {
            case 'ms_mobileloglevel':
                configuration.logging.level = environment[key];
                break;

            case 'sqlconnstr_ms_tableconnectionstring':
            case 'sqlazureconnstr_ms_tableconnectionstring':
            case 'ms_tableconnectionstring':
                configuration.data = assign(configuration.data || {}, connectionString.parse(environment[key]));
                break;

            case 'ms_databaseschemaname':
                configuration.data.schema = environment[key];
                break;

            case 'ms_dynamicschema':
                configuration.data.dynamicSchema = parseBoolean(environment[key]);
                break;

            case 'ema_runtimeurl':
                configuration.auth.gatewayUrl = environment[key];
                break;

            case 'website_auth_signing_key':
                configuration.auth.secret = environment[key];
                break;

            case 'ms_mobileappname':
            case 'ms_mobileservicename':
                configuration.name = environment[key];
                break;

            case 'ms_crossdomainwhitelist':
                environment[key].split(',').forEach(function (origin) {
                    configuration.cors.origins.push(origin);
                });
                break;

            case 'ms_notificationhubname':
                configuration.notifications.hubName = environment[key];
                break;

            case 'customconnstr_ms_notificationhubconnectionstring':
            case 'ms_notificationhubconnectionstring':
                configuration.notifications.connectionString = environment[key];
                break;

            case 'ms_debugmode':
                configuration.debug = parseBoolean(environment[key]);
                break;

            case 'ms_disableversionheader':
                if(parseBoolean(environment[key]))
                    configuration.version = undefined;
                break;

            case 'ms_skipversioncheck':
                configuration.skipVersionCheck = parseBoolean(environment[key]);
                break;

            case 'website_hostname':
                configuration.auth.audience = 'https://' + environment[key] + '/';
                configuration.auth.issuer = 'https://' + environment[key] + '/';
                break;
        }
    });

    return configuration;
};

function parseBoolean(value) {
    return (value === true) ||
        (value && value.toLowerCase() === 'true' || value === '1');
}
