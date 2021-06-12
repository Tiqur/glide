import { w3cwebsocket as W3CWebSocket } from "websocket";
import { GlobalContext } from '../components/GlobalContext.jsx';
import { useContext, useEffect } from 'react';

const OpenWebsockets = () => {
  const { logState, configState, statusState, tokenDataState } = useContext(GlobalContext);
  const [status, setStatus] = statusState;
  const [config, setConfig] = configState;
  const [logs, setLogs] = logState;
  const [tokenData, setTokenData] = tokenDataState;
  const max_ema_interval = Math.max.apply(Math, config.ema_intervals);


  useEffect(() => {
    setLogs((oldLogs) => [...oldLogs, {date: new Date(), loading: true, message: 'Initializing websocket connections...'}]);
    // URL connection
    const ws = new WebSocket('wss://stream.binance.com:9443/ws');

    ws.onopen = () => {
        ws.send(JSON.stringify({
          method: 'SUBSCRIBE',
          params: config.watchlist.map(e => e.toLowerCase() + '@ticker'),
          id: 1
        }));
    }

    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      const [current_token, current_price, time] = [data.s, parseFloat(data.c), data.E];

      // Update current price in token data state
      if (current_token in tokenData) tokenData[current_token]['current_price'] = current_price;

      // Merge data if fully downloaded
      Object.keys(tokenData).forEach(token => {
        if (token === current_token) {
          Object.keys(tokenData[token]).forEach(time_interval => {
            // Make sure 'time_interval' isn't 'current_price'
            if (typeof tokenData[token][time_interval] === 'object' && tokenData[token][time_interval] && tokenData[token][time_interval]['ohlvc'].length > 0) {
              const ohlvc_arr = tokenData[token][time_interval]['ohlvc'];

              // Make sure fully downloaded
              if (ohlvc_arr.length === config.precision + max_ema_interval) {
                const last_ohlvc = ohlvc_arr[ohlvc_arr.length-1];
                
                // Calculate the time between the current time, and the previous candle's end time.
                // This will show us if we should update the current candle's close_price, or create a new candle
                const time_between = time - last_ohlvc.end_time;

                // If on same candle as last downloaded
                if (time_between < 0) {
                  // Update properties
                  last_ohlvc.close = current_price;









                } else {
                  // Update ema for each ema_interval
                  Object.keys(tokenData[token][time_interval]).forEach(ema_interval => {
                    if (ema_interval != 'ohlvc') {
                      const temp_emas = tokenData[token][time_interval][ema_interval];

                      // Calculate ema
                      const prev_ema = temp_emas[temp_emas.length-1];
                      const k = 2 / (ema_interval + 1);
                      const current_ema = current_price * k + prev_ema * (1 - k);

                      // Append previous ema
                      temp_emas.push(current_ema);
                      temp_emas.shift();
                    }
                  })

                  // Append new ohlvc
                  const interval_ms = last_ohlvc.end_time - last_ohlvc.start_time + 1;

                  const new_ohlvc = {
                    start_time: last_ohlvc.end_time + interval_ms + 1,
                    open: current_price,
                    high: current_price,
                    low: current_price,
                    close: current_price,
                    end_time: last_ohlvc.end_time + interval_ms * 2
                  }

                  ohlvc_arr.push(new_ohlvc);

                  // Remove first element so that there is only ever a fixed amount ( avoid memory leaks ) ( temp fix )
                  ohlvc_arr.shift();


                }
              }
            }
          })
        }
      })
    }
  }, [])


  return null;
}

export default OpenWebsockets;
