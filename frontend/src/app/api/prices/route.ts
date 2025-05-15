// File: src/app/api/prices/route.ts

import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { NextResponse } from "next/server";

const client = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});


export async function GET() {
    try {
        const symbols = ["AAPL", "MSFT", "GOOG", "TSLA", "AMZN", "NVDA", "META", "NFLX", "INTC", "AMD"];
        const now = new Date();
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();


        const allResults = [];

        for (const symbol of symbols) {
            const command = new QueryCommand({
                TableName: "StockPrices",
                KeyConditionExpression: "symbol = :s AND #ts > :t",
                ExpressionAttributeValues: {
                    ":s": { S: symbol },
                    ":t": { S: twentyFourHoursAgo },
                },
                ExpressionAttributeNames: {
                    "#ts": "timestamp"
                },
                ScanIndexForward: false, // latest first
                Limit: 1 // just the latest item
            });

            const result = await client.send(command);
            if (result.Items && result.Items.length > 0) {
                allResults.push(unmarshall(result.Items[0]));
            }
        }

        return NextResponse.json(allResults);
    } catch (err) {
        console.error("DynamoDB query error:", err);
        return NextResponse.json({ error: "Failed to fetch stock prices" }, { status: 500 });
    }
}
