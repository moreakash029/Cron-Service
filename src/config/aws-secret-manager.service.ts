import { SecretsManager } from "@aws-sdk/client-secrets-manager";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class AwsSecretsService {
    private readonly logger = new Logger(AwsSecretsService.name);
    private readonly client = new SecretsManager({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        },
    });

    async getSecretByArn(arn: string) {
        try {
            const data = await this.client.getSecretValue({ SecretId: arn });
            return JSON.parse(data.SecretString ?? '{}');
        } catch (error) {
            this.logger.error("Failed to fetch AWS Secret:", error);
            throw new Error("Unable to fetch Credentials from AWS Secrets Manager");
        }
    }
}
