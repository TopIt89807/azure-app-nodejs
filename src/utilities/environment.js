// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
module.exports = {
    debug: process.execArgv.some(function (arg) {
        return arg.indexOf('--debug') === 0;
    })
    // hosted: function () {
    //
    // }
};
