// ----------------------------------------------------------------------------
// Copyright (c) 2015 Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------

module.exports = function (req, res, next) {
    var context = req.azureMobile;

    // Skip api key if there is an authenticated user and valid api keys are not always required
    if (context.user && !context.configuration.alwaysRequireValidApiKey)
        return next();

    // Validate zumo-api-key header against environment variable.
    // The header could also be validated against config setting, etc
    var apiKey = process.env['zumo_api_key'];
    if (apiKey && req.get('zumo-api-key') != apiKey)
        return res.status(401).send('This operation requires a valid api key');
    else
        return next();
}
