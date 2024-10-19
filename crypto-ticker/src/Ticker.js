// // src/Ticker.js
// import React, { useEffect, useState } from 'react';

// const Ticker = () => {
//   const [tickerData, setTickerData] = useState(null);
//   const [connectionStatus, setConnectionStatus] = useState('Connecting...');

//   useEffect(() => {
//     const ws = new WebSocket('wss://ws.kraken.com');

//     ws.onopen = () => {
//       setConnectionStatus('Connected');
//       const subscribeMessage = {
//         event: 'subscribe',
//         pair: ['BTC/USD'],
//         subscription: {
//           name: 'ticker',
//         },
//       };
//       ws.send(JSON.stringify(subscribeMessage));
//     };

//     ws.onmessage = (event) => {
//       const data = JSON.parse(event.data);

//       // Kraken sends heartbeat and system status events
//       if (data.event) {
//         if (data.event === 'subscriptionStatus' && data.status === 'subscribed') {
//           console.log('Subscribed to ticker feed');
//         }
//         return;
//       }

//       // Ticker data comes as an array, e.g.,
//       // [channelID, { ...ticker data ... }, channelName, pair]
//       if (Array.isArray(data) && data.length >= 2) {
//         const tickerInfo = data[1];
//         setTickerData(tickerInfo);
//       }
//     };

//     ws.onerror = (error) => {
//       console.error('WebSocket error:', error);
//       setConnectionStatus('Error');
//     };

//     ws.onclose = () => {
//       setConnectionStatus('Disconnected');
//     };

//     // Cleanup on component unmount
//     return () => {
//       ws.close();
//     };
//   }, []);

//   return (
//     <div style={styles.container}>
//       <h1>Kraken BTC/USD Ticker</h1>
//       <p>Status: {connectionStatus}</p>
//       {tickerData ? (
//         <div style={styles.ticker}>
//           <p>
//             <strong>Ask:</strong> {tickerData.a[0]}
//           </p>
//           <p>
//             <strong>Bid:</strong> {tickerData.b[0]}
//           </p>
//           <p>
//             <strong>Last Trade Price:</strong> {tickerData.c[0]}
//           </p>
//           <p>
//             <strong>Volume (24h):</strong> {tickerData.v[1]}
//           </p>
//         </div>
//       ) : (
//         <p>Loading ticker data...</p>
//       )}
//     </div>
//   );
// };

// // Simple inline styles for better presentation
// const styles = {
//   container: {
//     fontFamily: 'Arial, sans-serif',
//     padding: '20px',
//     maxWidth: '400px',
//     margin: 'auto',
//     textAlign: 'center',
//   },
//   ticker: {
//     border: '1px solid #ccc',
//     borderRadius: '8px',
//     padding: '15px',
//     marginTop: '20px',
//     backgroundColor: '#f9f9f9',
//   },
// };

// export default Ticker;

// src/Ticker.js

import React, { useEffect, useState } from "react";

/**
 * Ticker Component
 * Connects to Kraken's WebSocket API, subscribes to BTC/USD ticker,
 * receives data, flattens it, logs to console, and displays on the webpage.
 */
const Ticker = () => {
  // State to hold the flattened ticker data
  const [flattenedData, setFlattenedData] = useState(null);

  // State to track the WebSocket connection status
  const [connectionStatus, setConnectionStatus] = useState("Connecting...");

  /**
   * Helper function to flatten the nested ticker data into a single-level object.
   * @param {Object} data - The nested ticker data received from WebSocket.
   * @returns {Object} - The flattened ticker data.
   */
  const flattenTickerData = (data) => {
    return {
      Pair: data.pair,
      ChannelName: data.channel_name,
      BestAskPrice: data.a[0],
      BestAskWholeLotVolume: data.a[1],
      BestAskLotVolume: data.a[2],
      BestBidPrice: data.b[0],
      BestBidWholeLotVolume: data.b[1],
      BestBidLotVolume: data.b[2],
      ClosePrice: data.c[0],
      CloseLotVolume: data.c[1],
      VolumeToday: data.v[0],
      VolumeLast24h: data.v[1],
      VWAPToday: data.p[0],
      VWAPLast24h: data.p[1],
      NumberOfTradesToday: data.t[0],
      NumberOfTradesLast24h: data.t[1],
      LowPriceToday: data.l[0],
      LowPriceLast24h: data.l[1],
      HighPriceToday: data.h[0],
      HighPriceLast24h: data.h[1],
      OpenPriceToday: data.o[0],
      OpenPriceLast24h: data.o[1],
    };
  };

  useEffect(() => {
    // Initialize WebSocket connection
    const ws = new WebSocket("wss://ws.kraken.com");

    // Handle WebSocket connection open event
    ws.onopen = () => {
      setConnectionStatus("Connected");
      const subscribeMessage = {
        event: "subscribe",
        pair: ["SOL/USD"],
        subscription: {
          name: "ticker",
        },
      };
      ws.send(JSON.stringify(subscribeMessage));
    };

    // Handle incoming WebSocket messages
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // Handle subscription status messages
        if (data.event) {
          if (
            data.event === "subscriptionStatus" &&
            data.status === "subscribed"
          ) {
            console.log("Subscribed to BTC/USD ticker feed.");
          }
          return;
        }

        // Handle ticker data messages
        if (Array.isArray(data) && data.length >= 4) {
          const tickerInfo = data[1];
          const channelName = data[2];
          const pair = data[3];

          // Combine the received data into a single object
          const combinedData = {
            ...tickerInfo,
            pair,
            channel_name: channelName,
          };

          // Flatten the combined data
          const flatData = flattenTickerData(combinedData);

          // Update state with flattened data
          setFlattenedData(flatData);

          // Log the flattened data to the console
          console.log("Flattened Ticker Data:", flatData);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    // Handle WebSocket errors
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setConnectionStatus("Error");
    };

    // Handle WebSocket connection close event
    ws.onclose = () => {
      setConnectionStatus("Disconnected");
    };

    // Cleanup function to close WebSocket connection when component unmounts
    return () => {
      ws.close();
    };
  }, []);

  /**
   * Renders the flattened ticker data in a table format.
   * @returns {JSX.Element} - The table displaying the flattened data.
   */
  const renderTable = () => {
    if (!flattenedData) return null;

    return (
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Field</th>
            <th style={styles.th}>Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(flattenedData).map(([key, value]) => (
            <tr key={key}>
              <td style={styles.td}>{key}</td>
              <td style={styles.td}>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div style={styles.container}>
      <h1>Kraken BTC/USD Ticker</h1>
      <p>Status: {connectionStatus}</p>
      {flattenedData ? (
        <div style={styles.tableContainer}>{renderTable()}</div>
      ) : (
        <p>Loading ticker data...</p>
      )}
    </div>
  );
};

// Inline styles for the component
const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    padding: "20px",
    maxWidth: "800px",
    margin: "auto",
    textAlign: "center",
  },
  tableContainer: {
    marginTop: "20px",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
  },
  th: {
    border: "1px solid #ddd",
    padding: "8px",
    backgroundColor: "#f2f2f2",
  },
  td: {
    border: "1px solid #ddd",
    padding: "8px",
  },
};

export default Ticker;
