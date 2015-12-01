// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
module.exports = {
    fromEnvironment: require('./fromEnvironment'),
    fromFile: require('./fromFile'),
    fromSettingsJson: require('./fromSettingsJson'),
    loader: require('./loader'),
    parseConnectionString: require('./connectionString').parse
}
