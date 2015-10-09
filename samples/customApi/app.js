var app = require('express')(),
    mobileApp = require('azure-mobile-apps')()

mobileApp.api.import('api')
mobileApp.api.use()
