interface Configuration {
    platform: string;
    basePath: string;
    configFile: string;
    promiseConstructor: (resolve: (result) => void, reject: (error) => void) => Thenable<any>;
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
    logging: LoggingConfiguration;
    data: MssqlDataConfiguration;
    auth: AuthConfiguration;
    cors: CorsConfiguration;
    notifications: NotificationsConfiguration;
}

interface DataConfiguration {
    provider: string;
}

interface MssqlDataConfiguration {
    provider: string;
    user: string;
    password: string;
    server: string;
    port: number;
    database: string;
    connectionTimeout: string;
    options: { encrypt: boolean };
    schema: string;
    dynamicSchema: boolean;
}

interface AuthConfiguration {
    secret: string;
    validateTokens: boolean;
}

interface LoggingConfiguration {
    level: string;
    transports: LoggingTransport[];
}

interface LoggingTransport { }

interface CorsConfiguration {
    maxAge: number;
    origins: string[];
}

interface NotificationsConfiguration {
    hubName: string;
    connectionString: string;
    endpoint: string;
    sharedAccessKeyName: string;
    sharedAccessKeyValue: string;
}