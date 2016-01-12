interface Express {
    configuration: Configuration;
    tables: ExpressTables;
}

declare module "azure-mobile-apps/express" {
    function api(configuration: Configuration): Express;
    module api { }
    export = api;   
}

/*
    api.api = apiMiddleware;
    api.tables = tableMiddleware;
    api.table = table;
    api.configuration = configuration;
    api.use = function () {
*/