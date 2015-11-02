// ----------------------------------------------------------------------------
// Copyright (c) 2015 Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------

// This contains all the defaults right now and is just an example.  You
// only need to include the differences between the defaults and your
// settings.  YOu can see all the settings at http://azure.github.io/azure-mobile-apps-node/global.html

// If you set debug, then use that.  If you are using Azure, then don't set
// DEBUG - use the MS_DebugMode app setting.
var debugValue = environment.debug || false;

module.exports = {
  platform: 'express',
  promiseConstructor: Promise,
  apiRootPath: '/api',
  tableRootPath: '/tables',
  debug: debugValue,
  maxTop: 1000,

  // Use this to disable the version header that is sent out
  //version: undefined,

  logging: {
    // Override for the Winston transports
    // for more info, see https://github.com/winstonjs/winston/blob/master/docs/transports.md
    // transports: {
      // Place any Winston compatible transport here
    //},
    level: debugValue ? 'debug' : 'info'
  },

  cors: {
    maxAge: 300,
    origins: [ 'localhost' ]
  },

  // See http://azure.github.io/azure-mobile-apps-node/global.html#dataConfiguration
  // Normally this is not required for Azure hosted environments - we pick it up
  // from the ConnectionString for SQL Azure in the App Settings of the Azure Portal
  //data: {
  //  provider: 'sql',
  //  server: 'localhost',
  //  database: 'my-mobile-app',
  //  user: 'db-username',
  //  password: 'db-password'
  //},

  // See http://azure.github.io/azure-mobile-apps-node/global.html#notificationsConfiguration
  // Normally this is not required for Azure hosted environments as it is in the
  // App Settings in the Azure Portal
  //notifications: {
  //  hubName: 'your-hub-name',
  //  connectionString: 'your-nh-connection-string'
  //},

  // See http://azure.github.io/azure-mobile-apps-node/global.html#authConfiguration
  // As with the other sensitive information, this is normally set within the Azure
  // Portal in App Settings.
  //auth: {
  //  secret: 'my-zumo-secret',
  //  expires: 1440 // in seconds
  //}
};
