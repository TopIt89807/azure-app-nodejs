// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
module.exports = function (req, res, next) {
    if(!req.azureMobile.user)
        res.status(401).send('You must be logged in to use this application');
    else
        next();
};
