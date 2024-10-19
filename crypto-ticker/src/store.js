// store.js
const mysql = require('mysql2');

// Create a connection to SingleStore
const connection = mysql.createConnection({
    host: 'svc-3482219c-a389-4079-b18b-d50662524e8a-shared-dml.aws-virginia-6.svc.singlestore.com',
    user: 'crypto',
    password: 'fYovlOR6RUURi0wVPHGkAFyXX443XvYa',
    database: 'crypto',
    port: '3333'
});

// Insert flattened data into the database
const storeTickerData = (flatData) => {
    const query = `
    INSERT INTO crypto_data (pair, channel_name, best_ask_price, best_ask_whole_lot_volume, best_ask_lot_volume,
                                    best_bid_price, best_bid_whole_lot_volume, best_bid_lot_volume, close_price, close_lot_volume,
                                    volume_today, volume_last_24hrs, vwap_today, vwap_last_24hrs, number_of_trades_today, number_of_trades_last_24hrs,
                                    low_price_today, low_price_last_24hrs, high_price_today, high_price_last_24hrs, open_price_today, open_price_last_24hrs)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

    connection.query(query, [
        flatData.Pair,
        flatData.ChannelName,
        flatData.BestAskPrice,
        flatData.BestAskWholeLotVolume,
        flatData.BestAskLotVolume,
        flatData.BestBidPrice,
        flatData.BestBidWholeLotVolume,
        flatData.BestBidLotVolume,
        flatData.ClosePrice,
        flatData.CloseLotVolume,
        flatData.VolumeToday,
        flatData.VolumeLast24h,
        flatData.VWAPToday,
        flatData.VWAPLast24h,
        flatData.NumberOfTradesToday,
        flatData.NumberOfTradesLast24h,
        flatData.LowPriceToday,
        flatData.LowPriceLast24h,
        flatData.HighPriceToday,
        flatData.HighPriceLast24h,
        flatData.OpenPriceToday,
        flatData.OpenPriceLast24h,
    ], (error, results) => {
        if (error) {
            console.error('Error inserting data:', error);
        } else {
            console.log('Data inserted:', results);
        }
    });
};

// Export the function to be used in Ticker.js
module.exports = { storeTickerData };
