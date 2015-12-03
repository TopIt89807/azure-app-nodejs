// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
/**
@module azure-mobile-apps/utilities/promises
@description
Provides a wrapper around standard promise libraries along with a number of helper
functions, allowing substitution of ES6 compliant promise implementations.
*/
﻿var constructor = typeof Promise === 'undefined'
    ? require('es6-promise').Promise
    : Promise;

var api = module.exports = {
    /** Gets the constructor that is used to create promises */
    getConstructor: function () {
        return constructor;
    },

    /** Sets the constructor to be used for creation of promises */
    setConstructor: function (promiseConstructor) {
        if (typeof promiseConstructor === 'function')
            constructor = promiseConstructor;
    },
    /** Creates a new promise from the provided executor */
    create: function (executor) {
        return new constructor(executor);
    },
    /** Returns a resolved promise */
    resolved: function (value) {
        return new constructor(function (resolve, reject) {
            resolve(value);
        });
    },
    /** Returns a rejected promise */
    rejected: function (error) {
        return new constructor(function (resolve, reject) {
            reject(error);
        });
    },
    /** Returns true if the specified object provides a "then" function */
    isPromise: function (target) {
        return target && target.then && target.then.constructor === Function;
    },
    /** Returns a promise that resolves after the specified delay */
    sleep: function (delay, result) {
        return new constructor(function (resolve, reject) {
            setTimeout(function () {
                resolve(result);
            }, delay);
        });
    },
    /** Returns a promise that resolves after all provided promises resolve */
    all: function (promises) {
        return constructor.all(promises);
    },

    /** Returns a promise that resolves after the promise created for each provided item has resolved in series */
    series: function (items, promiseFactory) {
        if(!items || items.length === 0)
            return api.resolved();

        return api.create(function (resolve, reject) {
            var index = 0,
                results = [];

            executeNextPromise();

            function executeNextPromise(previousResult) {
                results.push(previousResult);

                if(index === items.length)
                    resolve(results.slice(1));

                var promise = promiseFactory(items[index], index);
                index++;
                promise
                    .then(executeNextPromise)
                    .catch(reject);
            }
        })
    },

    /** Returns a promise that wraps a function expecting a callback with the signature (err, result) as the last argument */
    wrap: function (functionToWrap, thisArg) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return api.create(function (resolve, reject) {
                args.push(function (error, result) {
                    if(error)
                        reject(error);
                    else
                        resolve(result);
                });

                try {
                    functionToWrap.apply(thisArg, args);
                } catch (error) {
                    reject(error);
                }
            });
        };
    }
};
