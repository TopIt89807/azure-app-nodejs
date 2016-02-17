var api = {
    get: (request, response, next) => {
        var query = {
            sql: 'UPDATE TodoItem SET complete=@completed',
            parameters: [
                { name: 'completed', value: request.params.completed }
            ]
        };

        request.azureMobile.data.execute(query)
        .then(function (results) {
            response.json(results);
        });
    }
};

module.exports = api;
