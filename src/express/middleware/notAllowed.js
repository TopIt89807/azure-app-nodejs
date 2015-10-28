// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
module.exports = function (method) {
    return function (req, res, next) {
        res.status(405).send('Method ' + method + ' is not allowed');
    }
}