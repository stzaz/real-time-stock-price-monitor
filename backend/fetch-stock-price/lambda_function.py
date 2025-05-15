import json
import boto3
import yfinance as yf
from datetime import datetime

# Your actual SQS queue URL
QUEUE_URL = 'https://sqs.us-east-2.amazonaws.com/001047761193/stock-price-queue'

# List of 10 popular stock symbols
STOCK_SYMBOLS = [
    'AAPL',  # Apple
    'MSFT',  # Microsoft
    'GOOG',  # Alphabet (Google)
    'TSLA',  # Tesla
    'AMZN',  # Amazon
    'NVDA',  # NVIDIA
    'META',  # Meta Platforms (Facebook)
    'NFLX',  # Netflix
    'INTC',  # Intel
    'AMD'    # AMD
]

sqs = boto3.client('sqs')

def get_stock_price(symbol):
    print(f"[INFO] Fetching price for {symbol}...")
    ticker = yf.Ticker(symbol)
    data = ticker.history(period='1d', interval='1m')
    
    if data.empty:
        print(f"[WARNING] No data returned for {symbol}.")
        return None

    latest_price = float(data['Close'].iloc[-1])
    return latest_price

def lambda_handler(event, context):
    for symbol in STOCK_SYMBOLS:
        print(f"[INFO] Processing symbol: {symbol}")
        try:
            price = get_stock_price(symbol)
            if price is None:
                print(f"[WARNING] No price data for {symbol}. Skipping.")
                continue

            message = {
                'symbol': symbol,
                'price': price,
                'timestamp': datetime.utcnow().isoformat()
            }

            print(f"[INFO] Sending message to SQS: {message}")
            sqs.send_message(
                QueueUrl=QUEUE_URL,
                MessageBody=json.dumps(message)
            )
            print("[INFO] Message sent successfully.")

        except Exception as e:
            print(f"[ERROR] Error processing {symbol}: {e}")
            continue  # Continue to next symbol

    return {
        'statusCode': 200,
        'body': json.dumps('Processed all stock symbols.')
    }
