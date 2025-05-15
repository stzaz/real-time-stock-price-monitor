import json
import boto3
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('StockPrices')

def lambda_handler(event, context):
    print("[INFO] Processing SQS message batch...")

    for record in event['Records']:
        body = json.loads(record['body'])

        symbol = body['symbol']
        price = Decimal(str(body['price']))  # DynamoDB requires Decimal for float
        timestamp = body['timestamp']

        print(f"[INFO] Storing: {symbol} @ {price} on {timestamp}")

        table.put_item(
            Item={
                'symbol': symbol,
                'timestamp': timestamp,
                'price': price
            }
        )

    return {
        'statusCode': 200,
        'body': json.dumps('Successfully stored stock prices.')
    }
