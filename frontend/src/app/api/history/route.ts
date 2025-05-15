// File: src/app/api/history/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

const client = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const symbol = searchParams.get('symbol');

    if (!symbol) {
        return NextResponse.json({ error: 'Missing symbol' }, { status: 400 });
    }

    try {
        const command = new QueryCommand({
            TableName: 'StockPrices',
            KeyConditionExpression: 'symbol = :s',
            ExpressionAttributeValues: {
                ':s': { S: symbol },
            },
            ScanIndexForward: false, // Get newest first
            Limit: 50
        });

        const result = await client.send(command);

        const items = (result.Items || []).map((item) => {
            const record = unmarshall(item);
            return {
                timestamp: record.timestamp,
                price: record.price,
            };
        });

        // Reverse for chart to show oldest to newest
        const sorted = items.reverse();

        return NextResponse.json(sorted);
    } catch (err) {
        console.error('Error fetching history:', err);
        return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
    }
}
