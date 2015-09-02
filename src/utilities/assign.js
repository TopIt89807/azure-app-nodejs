// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
﻿module.exports = function (target, source) {
    var from;
    var keys;
    var to = toObject(target);

    for (var s = 1; s < arguments.length; s++) {
        from = arguments[s];
        keys = Object.keys(Object(from));

        for (var i = 0; i < keys.length; i++) {
            // if both values are objects, assign recursively
            if(typeof to[keys[i]] === 'object' && typeof from[keys[i]] === 'object')
                module.exports(to[keys[i]], from[keys[i]]);
            else
                to[keys[i]] = from[keys[i]];
        }
    }

    return to;
};

function toObject(val) {
    if (val === null || val === undefined) {
        throw new TypeError('Object.assign cannot be called with null or undefined');
    }

    return Object(val);
}
