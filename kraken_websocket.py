import asyncio
import websockets
import json
import sys


# Function to connect to Kraken WebSocket API and subscribe to the ticker feed
async def connect_to_kraken(pair):
    uri = "wss://ws.kraken.com"  # Kraken WebSocket API public endpoint

    async with websockets.connect(uri) as websocket:
        # Prepare the subscription message
        subscription_message = {
            "event": "subscribe",
            "pair": [pair],
            "subscription": {"name": "ticker"},
        }

        # Send the subscription message
        await websocket.send(json.dumps(subscription_message))
        print(f"Subscribed to ticker feed for {pair}")

        # Keep listening for messages
        while True:
            try:
                response = await websocket.recv()
                data = json.loads(response)

                # Check for heartbeat event
                if "event" in data and data["event"] == "heartbeat":
                    print("Heartbeat received.")

                # Check if the message contains ticker data (list format and ends with 'ticker')
                elif isinstance(data, list) and len(data) > 1 and data[-1] == "ticker":
                    ticker_info = data[1]  # Ticker information
                    pair_symbol = data[-2]  # Pair symbol (e.g., SHIB/USD)

                    # Print ticker updates
                    print(f"\nTicker Update for {pair_symbol}:")
                    print(f"  Best Ask: {ticker_info['a'][0]}")
                    print(f"  Best Bid: {ticker_info['b'][0]}")
                    print(f"  Last Price: {ticker_info['c'][0]}")
                    print(f"  Volume Today: {ticker_info['v'][0]}")
                    print(f"  Volume Last 24h: {ticker_info['v'][1]}")
                    print(f"  Number of Trades Today: {ticker_info['t'][0]}")
                    print(f"  Number of Trades Last 24h: {ticker_info['t'][1]}")
                    print(f"  High Price Today: {ticker_info['h'][0]}")
                    print(f"  High Price Last 24h: {ticker_info['h'][1]}")
                    print(f"  Low Price Today: {ticker_info['l'][0]}")
                    print(f"  Low Price Last 24h: {ticker_info['l'][1]}")
                    print("-------------------------------")

                else:
                    print(f"Unknown message type: {data}")

            except websockets.exceptions.ConnectionClosed:
                print("Connection closed, reconnecting...")
                break


# Main entry point
if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python kraken_websocket.py <currency_pair>")
        print("Example: python kraken_websocket.py SHIB/USD")
        sys.exit(1)

    # Get the currency pair from command-line arguments
    currency_pair = sys.argv[1]

    # Run the WebSocket connection
    asyncio.get_event_loop().run_until_complete(connect_to_kraken(currency_pair))
