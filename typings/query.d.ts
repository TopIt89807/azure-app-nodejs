declare var query: Query;
declare module "azure-mobile-apps/src/query" {
    export = query; 
}

interface Query {
    create(tableName: string): QueryJs;
    fromRequest(req: Request): QueryJs;
    toOData(query: QueryJs): OData;
}

interface QueryJs {
    includeTotalCount: boolean;
    orderBy(properties: string): QueryJs;
    orderByDescending(properties: string): QueryJs;
    select(properties: string): QueryJs;
    skip(count: number): QueryJs;
    take(count: number): QueryJs;
    where(filter: any): QueryJs;
    getComponents(): any;
}

interface OData {
    table: string;
    filters: string;
    ordering: string;
    orderClauses: string;
    skip: number;
    take: number;
    selections: string;
    includeTotalCount: boolean;
} 