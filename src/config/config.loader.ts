import * as dotenv from 'dotenv';
import { AwsSecretsService } from './aws-secret-manager.service';
import { AppConfig, ENV_TYPE } from './config.interface';
import { validateConfig } from './config.validation';
dotenv.config();

export const loadConfig = async () => {
    try {
        const env = process.env.NODE_ENV as ENV_TYPE;
        const arn = process.env.AWS_SECRET_ARN;
        const secretsService = new AwsSecretsService();
        const secrets = await secretsService.getSecretByArn(arn!);

        Object.entries(secrets).forEach(([key, value]) => {
            process.env[key] = String(value);
        });

        const config: AppConfig = {
            NODE_ENV: env,
            PORT: secrets.PORT || 3000,
            DB_URL: secrets.MONGODB_URL,
            APP_TIMEZONE: secrets.APP_TIMEZONE,
        };

       return validateConfig(config)
    } catch (error) {
        console.error("Failed to load config:", error);
        throw error;
    }
};
