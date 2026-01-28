import * as Joi from 'joi';
import { AppConfig } from './config.interface';

export function validateConfig(config: AppConfig) {
    const schema = Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'stage', 'prod').required(),
        PORT: Joi.number().required(),
        DB_URL: Joi.string()
            .uri({ scheme: ['mongodb', 'mongodb+srv'] })
            .required()
            .messages({
                'any.required': 'DB_URL is required. Please set it in your .env file or environment variables.',
                'string.uri': 'DB_URL must be a valid MongoDB connection string.',
            }),
        APP_TIMEZONE: Joi.string().default('UTC'),
    });

    const { error, value } = schema.validate(config, {
        abortEarly: false,
        allowUnknown: true, // Allow other env vars to pass through  
    });

    if (error) {
        throw new Error(`Config validation error: ${error.message}`);
    }

    return value;
}
