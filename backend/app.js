const express = require('express');
const cors = require('cors');
const app = express();
const mysql = require('mysql2');
const port = 5002;

// Middleware to handle CORS
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

const conn = mysql.createConnection({
    host: "svc-3482219c-a389-4079-b18b-d50662524e8a-shared-dml.aws-virginia-6.svc.singlestore.com",
    user: "crypto",
    port: 3333,
    password: "fYovlOR6RUURi0wVPHGkAFyXX443XvYa",
    database: "crypto",
    ssl: {
        ca: `backend/singlestore_bundle.pem`,
        rejectUnauthorized: false  // Download from the URL in the error
    }
});
// POST route to handle store-ticker
app.post('/store-ticker', (req, res) => {
    const data = req.body;

    // Log the received data for debugging
    console.log("Received data:", data);

    // Prepare the SQL INSERT query
    const query = `
        INSERT INTO crypto_data (pair, best_ask_price, best_ask_whole_lot_volume, best_ask_lot_volume,
                                        best_bid_price, best_bid_whole_lot_volume, best_bid_lot_volume, close_price, close_lot_volume,
                                        volume_today, volume_last_24hrs, vwap_today, vwap_last_24hrs, number_of_trades_today, number_of_trades_last_24hrs,
                                        low_price_today, low_price_last_24hrs, high_price_today, high_price_last_24hrs, open_price_today, open_price_last_24hrs)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // Prepare the values to be inserted
    const values = [
        data.Pair, data.BestAskPrice, data.BestAskWholeLotVolume, data.BestAskLotVolume,
        data.BestBidPrice, data.BestBidWholeLotVolume, data.BestBidLotVolume, data.ClosePrice, data.CloseLotVolume,
        data.VolumeToday, data.VolumeLast24hrs, data.VWAPToday, data.VWAPLast24hrs, data.NumberOfTradesToday,
        data.NumberOfTradesLast24hrs, data.LowPriceToday, data.LowPriceLast24hrs, data.HighPriceToday,
        data.HighPriceLast24hrs, data.OpenPriceToday, data.OpenPriceLast24hrs
    ];

    // Execute the query and insert the data into SingleStore
    conn.query(query, values, (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).json({ error: 'Error inserting data into SingleStore' });
        }

        console.log('Data inserted successfully:', result);
        res.json({
            message: 'Ticker data stored successfully!',
            result: result
        });
    });
});


// Basic route for testing
app.get('/', (req, res) => {
    res.send('Hello from Express!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
