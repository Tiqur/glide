import { w3cwebsocket as W3CWebSocket } from "websocket";
import { GlobalContext } from '../components/GlobalContext.jsx';
import { useContext, useEffect } from 'react';

const OpenWebsockets = () => {
  const { logState, tokenDataState } = useContext(GlobalContext);
  const [logs, setLogs] = logState;
  const [tokenData, setTokenData] = tokenDataState;

  useEffect(() => {
    setLogs((oldLogs) => [...oldLogs, {date: new Date(), loading: true, message: 'Initializing websocket connections...'}]);
    // URL connection
    const ws = new WebSocket('wss://stream.binance.com:9443/ws');

    ws.onopen = () => {
        ws.send(JSON.stringify({
          method: 'SUBSCRIBE',
          params: ['dogeusdt', 'maticusdt', 'btcusdt', 'ethusdt'].map(e => e + '@ticker'),
          id: 1
        }));
    }

    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      const [token, current_price, time] = [data.s, parseFloat(data.c), data.E];

      // Update current price in token data state
      if (token in tokenData) tokenData[token]['current_price'] = current_price;

      // Merge data
      Object.keys(tokenData).forEach(token => {
        Object.keys(tokenData[token]).forEach(time_interval => {
          // Make sure 'time_interval' isn't 'current_price'
          if (typeof tokenData[token][time_interval] === 'object' && tokenData[token][time_interval] && tokenData[token][time_interval]['ohlvc'].length > 0) {
            const ohlvc_arr = tokenData[token][time_interval]['ohlvc'];
            const last_ohlvc = ohlvc_arr[ohlvc_arr.length-1];
            
            // Calculate the time between the current time, and the previous candle's end time.
            // This will show us if we should update the current candle's close_price, or create a new candle
            const time_between = time - last_ohlvc.end_time;

            // If on same candle as last downloaded
            if (time_between < 0) {
              // Update price
              last_ohlvc.close = current_price;
            } else {
              console.log("Append new")
            }

          }
        })
      })
    }
  }, [])


  return null;
}

export default OpenWebsockets;
