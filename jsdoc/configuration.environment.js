// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
/**
Azure Mobile Apps can be configured by providing values for specifiec environment
variables. These variables are described below. Variable names are not case sensitive.
For configuration using Javascript, see {@link configuration global configuration}.
@module azure-mobile-apps/configuration
@param {string} MS_MobileAppName Name of the mobile app
@param {string} MS_MobileLogLevel Minimum log level of messages to log (debug, info, warn, error)
@param {boolean} MS_DebugMode Enables or disables debug mode
@param {string} MS_TableConnectionString Connection string to use to connect to SQL Server
@param {boolean} MS_DynamicSchema Disables dynamic schema for tables when set to false
@param {string} EMA_RuntimeUrl Authentication gateway URL
@param {string} MS_SigningKey JWT token signing / validation key
@param {string} MS_CrossDomainWhitelist Comma delimited list of domains to allow cross domain requests from
@param {string} MS_NotificationHubName Name of the notification hub for the app
@param {string} MS_NotificationHubConnectionString Connection string to notification hub for the app
*/
