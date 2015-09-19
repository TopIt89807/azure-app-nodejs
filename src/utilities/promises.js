// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
﻿var constructor = typeof Promise === 'undefined'
    ? require('es6-promise').Promise
    : Promise;

module.exports = {
    setConstructor: function (promiseConstructor) {
        constructor = promiseConstructor;
    },
    create: function (executor) {
        return new constructor(executor);
    },
    resolved: function (value) {
        return new constructor(function (resolve, reject) {
            resolve(value);
        });
    },
    rejected: function (error) {
        return new constructor(function (resolve, reject) {
            reject(error);
        });
    },
    isPromise: function (target) {
        return target && target.then && target.then.constructor === Function;
    },
    sleep: function (delay) {
        return new constructor(function (resolve, reject) {
            setTimeout(resolve, delay);
        });
    },
    all: function (promises) {
        return constructor.all(promises);
    },
    wrap: function (functionToWrap, thisArg) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return module.exports.create(function (resolve, reject) {
                args.push(function (error, result) {
                    if(error)
                        reject(error);
                    else
                        resolve(result);
                });
                functionToWrap.apply(thisArg, args);
            });
        };
    }
};
