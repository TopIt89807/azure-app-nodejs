# Creating Data Providers for the Azure Mobile Apps SDK for Node

## API

Data providers should implement and export the following interface:

````
module.exports = function (configuration) {
    return {
        read: function (query) { },
        update: function (item, query) { },
        insert: function (item) { },
        delete: function (query, version) { },
        undelete: function (query, version) { },
        truncate: function () { },
        initialize: function () { }
    }
}
````

All functions should return a promise, as constructed by the `create` function in the `azure-mobile-apps/src/utilities/promises` module.

### read

The `query` parameter is a [queryjs Query object][queryjs]. It exposes a LINQ style API and exposes a comprehensive expression tree through the `getComponents` function.

Support for conversion to other formats is currently limited to an OData object representation. This can be done using the `toOData` function exposed by the `azure-mobile-apps/src/query` module. See [the source][toOData].

The read function should resolve to a result set that the Mobile Apps client SDK expects.
- For normal queries, this should be an array of results.
- When the provided query has the `single` property set, this should be a single object.
  If the item does not exist, it should resolve to undefined.
- When the provided query has the `includeTotalCount` property set, this should be an object
  with results and count properties.
- When the provided query has the `includeDeleted` property set, the results should include
  soft deleted items.

### update

The update function should update the item with the corresponding `id` in the database
and resolve to the updated item.
- If the `version` property is specified, it should only update the record if the `version`
  property matches.
- If the `version` property does not match, an `Error` should be thrown with the `concurrency`
  property set to true.
- The `updatedAt` property should be updated to the current date and time.
- The `version` property should be updated to a new unique value.

The `query` parameter is optional and allows filters such as user IDs to be applied to update operations.
The query is in the format described in the read section.

### insert

The insert function should insert a new record into the database and resolve to
the inserted item.
- If an item with the same `id` property already exists, an `Error` should be thrown with
  the `duplicate` property set.
- The `createdAt` and `updatedAt` properties should be set to the current date and time.
- The `version` property should be set to a unique value.

### delete

The delete function should delete the first record that matches the provided query and resolve to the deleted item.
- If the `version` parameter is specified, it should only delete the record if the `version`
  property matches.
- If the `version` property does not match, an `Error` should be thrown with the `concurrency`
  property set to true.
- If the `softDelete` option is specified on the table configuration, the record should be
  recoverable by calling undelete, and should be queryable by specifying the `includeDeleted`
  option on read queries.

The query object is in the format described in the read section. For simple data provider scenarios,
the query object has an `id` property corresponding with the value passed in the querystring.

Note that only the first item should be deleted as this is the behavior the client expects, and will return the deleted
item. This may change in future to allow deletion of multiple items.

### undelete
The undelete function should restore the first record that matches the provided query and resolve to the restored item.
- If the `version` parameter is specified, it should only restore the record if the `version`
  property matches.
- If the `version` property does not match, an `Error` should be thrown with the `concurrency`
  property set to true.
- If the `softDelete` option is not specified on the table configuration, this function
  should have no effect.

The query object is in the format described in the read section. For simple data provider scenarios,
the query object has an `id` property corresponding with the value passed in the querystring.

### truncate
The truncate function should clear all items from the table and resolve when complete.

### initialize
The initialize function should
- create appropriate schema as specified by the `columns` property of the table configuration,
- insert items into the table specified by the `seed` property of the table configuration,
- perform any other table initialization, such as index creation

## Consuming the Data Provider

Set the top level function to the `data.provider` configuration option. The `data` object is passed as the `configuration` parameter to the top level function to allow additional configuration options to be specified.

## Testing

A suite of integration tests to ensure compatibility will be provided soon.


[queryjs]: https://github.com/Azure/queryjs
[toOData]: https://github.com/Azure/azure-mobile-apps-node/blob/master/src/query/index.js
