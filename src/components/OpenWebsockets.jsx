import { w3cwebsocket as W3CWebSocket } from "websocket";
import { GlobalContext } from '../components/GlobalContext.jsx';
import { useContext, useEffect } from 'react';
import Decimal from 'decimal.js';

const alerts = (ohlvc_arr, token, config, setAlerts, time_interval, current_lock) => {

  // If all emas are calculated
  if (Object.keys(ohlvc_arr).length === config.ema_intervals.length) {
    const sorted_emas = Object.values(ohlvc_arr).sort((a, b) => {
      return a.lessThan(b) ? -1 : a.greaterThan(b) ? 1 : 0;
    });

    const ema_arr = Object.values(ohlvc_arr).reverse().toString();
    const sorted_ema_arr = Object.values(sorted_emas).toString();
    const crossed = ema_arr === sorted_ema_arr;

    // If crossed and x ms have elapsed since last time emas weren't crossed
    const lock_diff = Date.now() - current_lock;
    console.log(current_lock, lock_diff, crossed)
    if (crossed && lock_diff >= 5000) {
      setAlerts((oldAlerts) => [...oldAlerts, {time: Date.now(), token: token, interval: time_interval, ema: Object.values(ohlvc_arr).map(e => e.toString())}]);
    } 
    else if (crossed) {
      return current_lock;
    }
    else {
      return Date.now();
    }
  }
}


const calc_emas = (ohlvc_emas, previous_ohlvc, current_price, new_emas, token, config, setAlerts, time_interval, tokenData) => {
  const em = {};
  // Update ema for each ema_interval
  Object.keys(ohlvc_emas).forEach(ema_interval => {
    // Calculate ema
    const prev_ema = previous_ohlvc['emas'][ema_interval];
    const k = Decimal(2).div(Decimal(ema_interval).plus(1));
    const current_ema = current_price.times(k).plus(prev_ema.times(Decimal(1).minus(k)));

    // Update new emas
    new_emas[ema_interval] = current_ema;
    em[ema_interval] = current_ema;
  })

  // Alert
  tokenData[token][time_interval]['lock'] = alerts(em, token, config, setAlerts, time_interval, tokenData[token][time_interval]['lock']);
}

const OpenWebsockets = () => {
  const { logState, configState, alertState, statusState, tokenDataState } = useContext(GlobalContext);
  const [status, setStatus] = statusState;
  const [alerts, setAlerts] = alertState;
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
      if (!data.c || !data.E || !data.s) return;
      const [current_token, current_price, time] = [data.s, Decimal(data.c), data.E];


      // Update current price in token data state
      if (current_token in tokenData) tokenData[current_token]['current_price'] = current_price;

      // Merge data if fully downloaded
      Object.keys(tokenData).forEach(token => {
        if (token === current_token) {
          Object.keys(tokenData[token]).forEach(time_interval => {

            if (tokenData[token][time_interval] && tokenData[token][time_interval]['ohlvc'] && tokenData[token][time_interval]['ohlvc'].length > 0) {
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
                  if (current_price > last_ohlvc.high) last_ohlvc.high = current_price;
                  if (current_price < last_ohlvc.low) last_ohlvc.low = current_price;

                  // Update ema for each ema_interval
                  calc_emas(last_ohlvc['emas'], last_ohlvc, current_price, last_ohlvc, token, config, setAlerts, time_interval, tokenData);

                } else {
                  // Initialize new emas
                  const new_emas = {};
                  const previous_ohlvc = ohlvc_arr[ohlvc_arr.length-2];

                  // Update ema for each ema_interval
                  calc_emas(previous_ohlvc['emas'], previous_ohlvc, current_price, new_emas, token, config, setAlerts, time_interval, tokenData);

                  // Append new ohlvc
                  const interval_ms = last_ohlvc.end_time - last_ohlvc.start_time + 1;

                  const new_ohlvc = {
                    start_time: last_ohlvc.end_time + interval_ms + 1,
                    open: Decimal(current_price),
                    high: Decimal(current_price),
                    low: Decimal(current_price),
                    close: Decimal(current_price),
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
