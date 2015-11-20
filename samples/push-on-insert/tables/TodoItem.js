var azureMobileApps = require('azure-mobile-apps'),
    promises = require('azure-mobile-apps/src/utilities/promises'),
    logger = require('azure-mobile-apps/src/logger');

var table = azureMobileApps.table();

// Defines the list of columns
table.columns = {
	"userId": "string",
	"text": "string",
	"complete": "boolean"
};
// Turns off dynamic schema
table.dynamicSchema = false;

// Must be authenticated for this to work
table.access = 'authenticated';

// When adding record, send a push notification
table.insert(function (context) {
    // For details of the Notification Hubs JavaScript SDK, 
    // see https://azure.microsoft.com/en-us/documentation/articles/notification-hubs-nodejs-how-to-use-notification-hubs/
    
    // The tag is used to send the push notification to a subset of users
    var tag = '#sometag';
    
    // This push uses a template mechanism, so we need a template.
    var payload = '<?xml version="1.0" encoding="utf-8"?><wp:Notification xmlns:wp="WPNotification"><wp:Toast><wp:Text1>A new issue has arrived</wp:Text1></wp:Toast></wp:Notification>';
    
	// Create the push notification - we are using the send function 
    // The Notification Hubs JavaScript SDK uses callbacks, so we have
    // to wrap the call in a promise.
    promises.wrap(context.push.mpns.send)(tag, payload, 'toast', 22)
    .then(function () {
        context.execute();
    })
    .catch(function (error) {
        logger.error("Error while sending push notification: " + error);
        // If the push notification doesn't happen, we STILL want to execute the insert
        context.execute();
    });
});

module.exports = table;