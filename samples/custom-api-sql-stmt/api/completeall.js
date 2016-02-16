var api = {
    get: (request, response, next) => {
        var query = {
            sql: 'UPDATE TodoItem SET complete=@completed',
            parameters: [{
                completed: request.params.completed
            }]
        };

        request.azureMobile.data.execute(query)
        .then(function (results) {
            response.json(results);
        });
    }
};

module.exports = api;
