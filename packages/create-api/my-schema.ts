export interface paths {
    "/portal/comp/cityPartnerInfo": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** 根据赛事和地区id获取联系方式 */
        get: {
            parameters: {
                query?: {
                    /** @description 城市code */
                    cityCode?: string;
                    /** @description 大赛id */
                    compId?: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description 成功 */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            code: number;
                            data: {
                                id: number;
                                compId: number;
                                province: string;
                                city: string;
                                information: string;
                                isChannel: number;
                                code: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: never;
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export type operations = Record<string, never>;
