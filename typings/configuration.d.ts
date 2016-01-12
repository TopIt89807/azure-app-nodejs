interface Configuration {
    platform: string;
    basePath: string;
    configFile: string;
//    promiseConstructor: Promise;
    apiRootPath: string;
    tableRootPath: string;
    notificationRootPath: string;
    swaggerPath: string;
    authStubRoute: string;
    debug: boolean;
    version: string;
    apiVersion: string;
    homePage: boolean;
    swagger: boolean;
    maxTop: number;
    pageSize: number;
}

interface DataConfiguration {
    provider: string;
}

interface MssqlDataConfiguration {
    provider: string;
    schema: string;
    dynamicSchema: boolean;
}

interface AuthConfiguration {
    secret: string;
    validateTokens: boolean;
}

interface LoggingConfiguration {
    level: string;
    transports: [LoggingTransport];
}

interface LoggingTransport { }

interface CorsConfiguration {
    maxAge: number;
    origins: [string];
}