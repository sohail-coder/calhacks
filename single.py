import singlestoredb as s2

# SingleStore connection setup
conn = s2.connect(
    host="svc-3482219c-a389-4079-b18b-d50662524e8a-shared-dml.aws-virginia-6.svc.singlestore.com",
    user="crypto",
    port="3333",
    password="fYovlOR6RUURi0wVPHGkAFyXX443XvYa",
    database="crypto"
)

cursor = conn.cursor()

# Create table
# cursor.execute("""DROP  TABLE IF EXISTS crypto_data """)
cursor.execute("""
    CREATE TABLE IF NOT EXISTS crypto_data (
        id INT AUTO_INCREMENT PRIMARY KEY,
        pair VARCHAR(50),
        best_ask_price VARCHAR(50),
        best_ask_whole_lot_volume VARCHAR(50),
        best_ask_lot_volume VARCHAR(50),
        best_bid_price VARCHAR(50),
        best_bid_whole_lot_volume VARCHAR(50),
        best_bid_lot_volume VARCHAR(50),
        close_price VARCHAR(50),
        close_lot_volume VARCHAR(50),
        volume_today VARCHAR(50),
        volume_last_24hrs VARCHAR(50),
        vwap_today VARCHAR(50),
        vwap_last_24hrs VARCHAR(50),
        number_of_trades_today VARCHAR(50),
        number_of_trades_last_24hrs VARCHAR(50),
        low_price_today VARCHAR(50),
        low_price_last_24hrs VARCHAR(50),
        high_price_today VARCHAR(50),
        high_price_last_24hrs VARCHAR(50),
        open_price_today VARCHAR(50),
        open_price_last_24hrs VARCHAR(50)
    );
""")
# cursor.execute("DROP TABLE IF EXISTS default_data;")

# # Insert default data
# cursor.execute("""
#     INSERT INTO crypto_data (pair, best_ask, best_bid, last_price, volume_today, volume_last_24hrs, number_of_trades_today, number_of_trades_last_24hrs,
#                             high_price_today, high_price_last_24hrs, low_price_today, low_price_last_24hrs)
#     VALUES ("BTC/USD",
#     "45000.50000",
#     "44999.00000",
#     "45000.00000",
#     "120.50000000",
#     "1500.70000000",
#     "3500",
#     "25000",
#     "45200.00000",
#     "45500.00000",
#     "44800.00000",
#     "44600.00000");
# """)



conn.commit()
conn.close()
