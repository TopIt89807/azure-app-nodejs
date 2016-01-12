interface Express {
    configuration: Configuration;
    tables: ExpressTables;
}

declare module "azure-mobile-apps/express" {
    function returnedFunction(configuration: Configuration): Express;
    module returnedFunction { }
    export = returnedFunction;   
}

/*
    api.api = apiMiddleware;
    api.tables = tableMiddleware;
    api.table = table;
    api.configuration = configuration;
    api.use = function () {
*/