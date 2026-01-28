export type ENV_TYPE = "dev" | "stage" | "prod";

export interface AppConfig {
    NODE_ENV: ENV_TYPE;
    DB_URL: String;
    PORT: Number;
    APP_TIMEZONE: string;
}
