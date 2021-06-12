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

            if (tokenData[token][time_interval] && tokenData[token][time_interval].length > 0) {
              const ohlvc_arr = tokenData[token][time_interval];

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
                  if (current_price > last_ohlvc.high) last_ohlvc.high = current_price;
                  if (current_price < last_ohlvc.low) last_ohlvc.low = current_price;

                  // Update ema for each ema_interval
                  Object.keys(last_ohlvc['emas']).forEach(ema_interval => {

                    // Calculate ema
                    const prev_ema = last_ohlvc['emas'][ema_interval];
                    const k = 2 / (ema_interval + 1);
                    const current_ema = current_price * k + prev_ema * (1 - k);
                    
                    // Update new emas
                    last_ohlvc['emas'][ema_interval] = current_ema;
                  })


                } else {
                  // Initialize new emas
                  const new_emas = {};
                  const previous_ohlvc = ohlvc_arr[ohlvc_arr.length-2];

                  // Update ema for each ema_interval
                  Object.keys(previous_ohlvc['emas']).forEach(ema_interval => {

                    // Calculate ema
                    const prev_ema = previous_ohlvc['emas'][ema_interval];
                    const k = 2 / (ema_interval + 1);
                    const current_ema = current_price * k + prev_ema * (1 - k);
                    
                    // Update new emas
                    new_emas[ema_interval] = current_ema;
                  })

                  // Append new ohlvc
                  const interval_ms = last_ohlvc.end_time - last_ohlvc.start_time + 1;

                  const new_ohlvc = {
                    start_time: last_ohlvc.end_time + interval_ms + 1,
                    open: current_price,
                    high: current_price,
                    low: current_price,
                    close: current_price,
                    end_time: last_ohlvc.end_time + interval_ms * 2,
                    emas: new_emas
                  }
                  
                  // Append new ohlvc
                  ohlvc_arr.push(new_ohlvc);
                  // Remove first element to prevent eventual memory leak
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
