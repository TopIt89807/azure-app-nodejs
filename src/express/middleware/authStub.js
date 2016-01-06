// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var authModule = require('../../auth'),
    log = require('../../logger');

///.auth/login/facebook?session_mode=token&completion_type=postMessage&completion_origin=http%3A%2F%2Flocalhost%3A3001
module.exports = function (configuration) {
    var auth = authModule(configuration);

    if(configuration && configuration.auth && Object.keys(configuration.auth).length > 0) {
        return function (req, res, next) {
            // var envelope = { type: "LoginCompleted", oauth: {{oauth}}, error: {{error}} }
            // https://dacors.azurewebsites.net/.auth/login/done#token=%7B%22authenticationToken%22%3A%22eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzaWQ6MjQ5MGM5ZTQ1MjIwZjE3YTk1YzlkYTRkYTUyYzlhM2QiLCJpZHAiOiJtaWNyb3NvZnRhY2NvdW50IiwidmVyIjoiMyIsImlzcyI6Imh0dHBzOi8vZGFjb3JzLmF6dXJld2Vic2l0ZXMubmV0LyIsImF1ZCI6Imh0dHBzOi8vZGFjb3JzLmF6dXJld2Vic2l0ZXMubmV0LyIsImV4cCI6MTQ1MjA1ODUwMSwibmJmIjoxNDUyMDU0OTAxfQ.si7pxuFOSYOzm8Yf7EumNGREelYfUQRZFv5ME7X8dPo%22%2C%22user%22%3A%7B%22userId%22%3A%22sid%3A2490c9e45220f17a95c9da4da52c9a3d%22%7D%7D
            // https://dacors.azurewebsites.net/.auth/login/facebook?session_mode=token&completion_type=postMessage&completion_origin=http%3A%2F%2Flocalhost%3A3001
            // {"authenticationToken":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzaWQ6MjQ5MGM5ZTQ1MjIwZjE3YTk1YzlkYTRkYTUyYzlhM2QiLCJpZHAiOiJtaWNyb3NvZnRhY2NvdW50IiwidmVyIjoiMyIsImlzcyI6Imh0dHBzOi8vZGFjb3JzLmF6dXJld2Vic2l0ZXMubmV0LyIsImF1ZCI6Imh0dHBzOi8vZGFjb3JzLmF6dXJld2Vic2l0ZXMubmV0LyIsImV4cCI6MTQ1MjA1ODUwMSwibmJmIjoxNDUyMDU0OTAxfQ.si7pxuFOSYOzm8Yf7EumNGREelYfUQRZFv5ME7X8dPo","user":{"userId":"sid:2490c9e45220f17a95c9da4da52c9a3d"}}"

            var payload = {
                    "sub": "sid:00000000000000000000000000000000",
                    "idp": req.params.provider,
                    "ver": "3",
                    "iss": "urn:microsoft:windows-azure:zumo",
                    "aud": "urn:microsoft:windows-azure:zumo",
                    "exp": jwtDate(expiry()),
                    "nbf": jwtDate(new Date())
                },
                token = auth.sign(payload),
                envelope = {
                    type: "LoginCompleted",
                    oauth: {
                        authenticationToken: token,
                        user: { userId: payload.sub }
                    }
                };

            res.send("<script>window.parent.postMessage('" + JSON.stringify(envelope) + "', '*')</script>");

            function expiry() {
                var date = new Date();
                date.setDate(date.getDate() + 1);
                return date;
            }

            function jwtDate(date) {
                return Math.round(date.getTime() / 1000);
            }
        };
    }
};
