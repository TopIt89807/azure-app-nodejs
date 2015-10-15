// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
﻿module.exports = function (target, source) {
    // test for valid target
    toObject(target);

    // wrap defined arguments in objects
    var args = Array.prototype.slice.call(arguments).filter(function (arg) {
        return arg;
    }).map(function (definedArg) {
        return { m: definedArg };
    });

    // recursively merge object-wrapped arguments
    var merged = merge.apply(undefined, args);

    // return unwrapped merged arguments
    return merged.m;
}

function merge(target, source) {
    var from;
    var keys;
    var to = toObject(target);

    for (var s = 1; s < arguments.length; s++) {
        from = arguments[s];
        keys = Object.keys(Object(from));

        for (var i = 0; i < keys.length; i++) {
            
            // if first is object and second is function, swap to allow for recursive assignment
            if(isObj(to[keys[i]]) && isFunc(from[keys[i]])) {
                var temp = from[keys[i]];
                from[keys[i]] = to[keys[i]];
                to[keys[i]] = temp;
            }

            // if first is object or function and second is object, assign recursively
            if((isObj(to[keys[i]]) || isFunc(to[keys[i]])) && isObj(from[keys[i]]))
                merge(to[keys[i]], from[keys[i]]);
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

function isObj(obj) {
    return typeof obj === 'object';
}

function isFunc(obj) {
    return typeof obj === 'function';
}
