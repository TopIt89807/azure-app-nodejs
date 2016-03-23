// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
/**
 * Azure Mobile Apps can be configured by providing values for specific environment
 * variables. These variables are described below. Variable names are not case sensitive.
 * For configuration using Javascript, see {@link configuration global configuration}.
 * @module azure-mobile-apps/configuration/Environment Variables
 * @param {string} MS_MobileAppName Name of the mobile app
 * @param {string} MS_MobileLogLevel Minimum log level of messages to log (error, warn, info, verbose, debug, silly)
 * @param {boolean} MS_DebugMode Enables or disables debug mode
 * @param {string} MS_TableConnectionString Connection string to use to connect to SQL Server
 * @param {string} MS_TableSchema Default schema name for sql tables. Can override in table config
 * @param {boolean} MS_DynamicSchema Disables dynamic schema for tables when set to false
 * @param {string} EMA_RuntimeUrl Authentication gateway URL
 * @param {string} Website_Auth_Signing_Key JWT token signing / validation key
 * @param {string} MS_CrossDomainWhitelist Comma delimited list of domains to allow cross domain requests from
 * @param {string} MS_NotificationHubName Name of the notification hub for the app
 * @param {string} MS_NotificationHubConnectionString Connection string to notification hub for the app
 * @param {string} MS_DisableVersionHeader If specified, disables x-zumo-server-version header
 * @param {string} MS_SkipVersionCheck If specified, does not validate client api version before serving requests
 * @param {string} Website_Hostname Hostname of the mobile app, used as issuer & audience for auth
 */
var connectionString = require('../connectionString'),
    merge = require('deeply');

// determine various configuration information from environment such as web.config settings, etc.
module.exports = function (configuration, environment) {
    configuration = merge(configuration || {});
    configuration.data = configuration.data || {};
    environment = environment || process.env;

    Object.keys(environment).forEach(function (key) {
        switch(key.toLowerCase()) {
            case 'ms_mobileloglevel':
                configuration.logging.level = environment[key];
                break;

            case 'sqlconnstr_ms_tableconnectionstring':
            case 'sqlazureconnstr_ms_tableconnectionstring':
            case 'ms_tableconnectionstring':
                configuration.data.connectionString = environment[key];
                break;

            case 'ms_tableschema':
                configuration.data.schema = environment[key];
                break;

            case 'ms_dynamicschema':
                configuration.data.dynamicSchema = parseBoolean(environment[key]);
                break;

            case 'website_auth_signing_key':
                configuration.auth.secret = environment[key];
                break;

            case 'ms_mobileappname':
            case 'ms_mobileservicename':
            case 'website_site_name':
                configuration.name = environment[key];
                break;

            case 'ms_crossdomainwhitelist':
                environment[key].split(',').forEach(function (origin) {
                    configuration.cors.hostnames.push(origin);
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
                // using website_hostname to determine that we are hosted on Azure Web Apps
                configuration.hosted = true;

                configuration.auth.audience = 'https://' + environment[key] + '/';
                configuration.auth.issuer = 'https://' + environment[key] + '/';
                break;
        }
    });

    configuration.data = merge(configuration.data, connectionString.parse(configuration.data.connectionString));

    return configuration;
};

function parseBoolean(value) {
    return (value === true) ||
        (value && value.toLowerCase() === 'true' || value === '1');
}
