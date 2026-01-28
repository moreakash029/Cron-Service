
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { inHouseReportTemplates } from './utils/report-templates.util';
import { emailsparkpost } from './utils/email-sender.util';

@Injectable()
export class CommunicationReportService {
    private readonly logger = new Logger(CommunicationReportService.name);
    private readonly docClient: DynamoDBDocumentClient;

    constructor() {
        const client = new DynamoDBClient({
            region: process.env.AWS_REGION || 'ap-south-1',
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
            },
        });
        this.docClient = DynamoDBDocumentClient.from(client);
    }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT) // Runs at 00:00 every day
    // @Cron(CronExpression.EVERY_MINUTE) // For testing
    async handleDailyReport() {
        try {
            let emailsendstatus = process.env.DAILYREPORTSEND || "false";
            if (emailsendstatus === "false") {
                this.logger.log("Daily report sending is disabled (DAILYREPORTSEND is false).");
                return;
            }

            this.logger.log("Starting daily communication report generation...");

            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const formattedDate = yesterday.toISOString().split("T")[0];

            const response = await Promise.all([
                this.whatsappReport(formattedDate),
                this.smsReport(formattedDate),
                this.emailReport(formattedDate),
            ]);

            let templateInfo = await inHouseReportTemplates(
                "dailyreport",
                response,
                formattedDate
            );

            const emailResponse = await emailsparkpost(templateInfo);
            this.logger.log("Daily report email sent: " + JSON.stringify(emailResponse));
        } catch (error) {
            this.logger.error("Error generating daily report", error);
        }
    }

    private async whatsappReport(createdAt: string) {
        const initializeTemplateStats = () => {
            return {
                hitcount: 0,
                success: 0,
                sent: 0,
                read: 0,
                other: 0,
                unknown_subscriber: 0,
                deferred: 0,
                blocked_for_user: 0,
                hour_exceeded: 0,
            };
        };

        const TableName = process.env.WHATSAPPHITLOGS || "notification-whatsapp-hit-logs-dev";

        let items: any[] = [];
        let exclusiveStartKey: Record<string, any> | undefined;

        do {
            const command = new ScanCommand({
                TableName,
                ProjectionExpression:
                    "orderId,sent_status,success_status,read_status,blockedForUser_status,templateName,phone,whatsappstatus,errorcode,other_status,deferred_status,twentyFourHourExceeded_status,unknownSubscriber_status,created_at,details",
                FilterExpression: "contains(#created_at, :created_at)",
                ExpressionAttributeNames: {
                    "#created_at": "trigger_date_and_time",
                },
                ExpressionAttributeValues: {
                    ":created_at": createdAt,
                },
                ExclusiveStartKey: exclusiveStartKey,
            });

            const scanResult = await this.docClient.send(command);
            items = items.concat(scanResult.Items || []);
            exclusiveStartKey = scanResult.LastEvaluatedKey;
        } while (exclusiveStartKey);

        let result: any = {};

        items.forEach((el) => {
            const templateName = el.templateName;

            const templateStats = result[templateName] || initializeTemplateStats();

            templateStats.hitcount++;

            if (el.success_status === "Yes") templateStats.success++;
            if (el.sent_status === "Yes") templateStats.sent++;
            if (el.read_status === "Yes") templateStats.read++;
            if (el.other_status === "Yes") templateStats.other++;
            if (el.unknownSubscriber_status === "Yes")
                templateStats.unknown_subscriber++;
            if (el.deferred_status === "Yes") templateStats.deferred++;
            if (el.blockedForUser_status === "Yes") templateStats.blocked_for_user++;
            if (el.twentyFourHourExceeded_status === "Yes")
                templateStats.hour_exceeded++;

            result[templateName] = templateStats;
        });

        return {
            statusCode: 200,
            body: JSON.stringify({
                result,
            }),
        };
    }

    private async smsReport(createdAt: string) {
        const initializeTemplateStats = () => {
            return {
                hitcount: 0,
                success: 0,
                fail: 0,
            };
        };

        const TableName = process.env.SMSHITLOGS || "notification-sms-hit-logs-dev";

        let items: any[] = [];
        let exclusiveStartKey: Record<string, any> | undefined;

        do {
            const command = new ScanCommand({
                TableName,
                ProjectionExpression:
                    "id, order_id, customerName, templateName, phoneNo, created_at, sms_service_response",
                FilterExpression: "contains(#created_at, :created_at)",
                ExpressionAttributeNames: {
                    "#created_at": "trigger_date_and_time",
                },
                ExpressionAttributeValues: {
                    ":created_at": createdAt,
                },
                ExclusiveStartKey: exclusiveStartKey,
            });

            const scanResult = await this.docClient.send(command);
            items = items.concat(scanResult.Items || []);
            exclusiveStartKey = scanResult.LastEvaluatedKey;
        } while (exclusiveStartKey);

        let result: any = {};

        items.forEach((el) => {
            const templateName = el.templateName;
            const templateStats = result[templateName] || initializeTemplateStats();

            // Increment hit count
            templateStats.hitcount++;

            // Check SMS service response for success or failure
            if (el?.sms_service_response?.reason === "DELIVRD") {
                templateStats.success++;
            } else {
                templateStats.fail++;
            }

            // Update the result object
            result[templateName] = templateStats;
        });

        return {
            statusCode: 200,
            body: JSON.stringify({
                result,
            }),
        };
    }

    private async emailReport(createdAt: string) {
        const initializeTemplateStats = () => {
            return {
                hitcount: 0,
                bounce: 0,
                delivery: 0,
                injection: 0,
                delay: 0,
            };
        };

        const TableName = process.env.EMAILHITLOGS || "notification-email-hit-logs-dev";

        let items: any[] = [];
        let exclusiveStartKey: Record<string, any> | undefined;

        do {
            const command = new ScanCommand({
                TableName,
                ProjectionExpression: "id, customerEmail, templateName, sparkpost_status, created_at",
                FilterExpression: "contains(#created_at, :created_at)",
                ExpressionAttributeNames: {
                    "#created_at": "trigger_date_and_time",
                },
                ExpressionAttributeValues: {
                    ":created_at": createdAt,
                },
                ExclusiveStartKey: exclusiveStartKey,
            });

            const scanResult = await this.docClient.send(command);
            items = items.concat(scanResult.Items || []);
            exclusiveStartKey = scanResult.LastEvaluatedKey;
        } while (exclusiveStartKey);

        const result: any = {};

        items.forEach((el) => {

            if (el.created_at && typeof el.created_at === "string") {
                // Not used in logic but present in original code's if block condition
                // const date = new Date(el.created_at.replace(" ", "T"))
                //   .toISOString()
                //   .split("T")[0];

                const templateName = el.templateName;

                const templateStats = result[templateName] || initializeTemplateStats();

                templateStats.hitcount++;

                if (el.sparkpost_status === "bounce") {
                    templateStats.bounce++;
                }
                if (el.sparkpost_status === "delivery") {
                    templateStats.delivery++;
                }
                if (el.sparkpost_status === "injection") {
                    templateStats.injection++;
                }
                if (el.sparkpost_status === "delay") {
                    templateStats.delay++;
                }

                result[templateName] = templateStats;
            } else {
                console.error("Invalid or missing created_at value:", el);
            }
        });

        return {
            statusCode: 200,
            body: JSON.stringify({
                result,
            }),
        };
    }
}
