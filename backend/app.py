from flask import Flask, request, jsonify
import singlestoredb as s2
from flask_cors import CORS


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})



# Setup SingleStore connection
conn = s2.connect(
    host="svc-3482219c-a389-4079-b18b-d50662524e8a-shared-dml.aws-virginia-6.svc.singlestore.com",
    user="crypto",
    port=3333,
    password="fYovlOR6RUURi0wVPHGkAFyXX443XvYa",
    database="crypto"
)

@app.route('/store-ticker', methods=['POST', 'OPTIONS'])
def store_ticker_data():
    # if request.method == 'OPTIONS':
    #     # Handle preflight requests
    #     return _build_cors_preflight_response()

    # print("Store ticket called")
    # data = request.json
    # cursor = conn.cursor()

    # query = """
    # INSERT INTO crypto_ticker_data (pair, channel_name, best_ask_price, best_ask_whole_lot_volume, best_ask_lot_volume,
    #                                 best_bid_price, best_bid_whole_lot_volume, best_bid_lot_volume, close_price, close_lot_volume,
    #                                 volume_today, volume_last_24hrs, vwap_today, vwap_last_24hrs, number_of_trades_today, number_of_trades_last_24hrs,
    #                                 low_price_today, low_price_last_24hrs, high_price_today, high_price_last_24hrs, open_price_today, open_price_last_24hrs)
    # VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    # """
    
    # values = (
    #     data['Pair'], data['ChannelName'], data['BestAskPrice'], data['BestAskWholeLotVolume'], data['BestAskLotVolume'],
    #     data['BestBidPrice'], data['BestBidWholeLotVolume'], data['BestBidLotVolume'], data['ClosePrice'], data['CloseLotVolume'],
    #     data['VolumeToday'], data['VolumeLast24hrs'], data['VWAPToday'], data['VWAPLast24hrs'], data['NumberOfTradesToday'],
    #     data['NumberOfTradesLast24hrs'], data['LowPriceToday'], data['LowPriceLast24hrs'], data['HighPriceToday'],
    #     data['HighPriceLast24hrs'], data['OpenPriceToday'], data['OpenPriceLast24hrs']
    # )
    
    # cursor.execute(query, values)
    # conn.commit()

    return _corsify_actual_response(jsonify({"message": "Data inserted successfully"}))

@app.route('/')
def hello():
    return _corsify_actual_response(jsonify({"message": "Hello"}))

# Helper to build CORS response for preflight requests
def _build_cors_preflight_response():
    response = jsonify({"message": "CORS preflight"})
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    return response

# Helper to add CORS headers to actual responses
def _corsify_actual_response(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

if __name__ == '__main__':
    app.run(debug=True, port=5000)
