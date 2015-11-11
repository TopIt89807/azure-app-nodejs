// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var path = require('path');

module.exports = function (configuration) {
    // settings.json file is located in D:\home\site\diagnostics - site root is at D:\home\site\wwwroot
    var basePath = configuration.basePath || './',
        settingsPath = path.resolve(basePath, '../diagnostics/settings.json'),
        levelMappings = {
            'Verbose': 'silly',
            'Information': 'info',
            'Error': 'error',
            'Warning': 'warn'
        };

    try {
        var settings = require(settingsPath);
        // if AzureDriveEnabled is true (i.e. Application Logging (filesystem) is turned on in the portal), this will override previous settings
        if(settings.AzureDriveEnabled && settings.AzureDriveTraceLevel) {
            configuration.logging = configuration.logging || {};
            configuration.logging.level = levelMappings[settings.AzureDriveTraceLevel] || 'warn';
        }
    } catch(e) { }

    return configuration;
}
