import axios from 'axios';
import { GlobalContext } from '../components/GlobalContext.jsx';
import { useContext, useEffect } from 'react';
import Decimal from 'decimal.js';
const PRECISION = 28;

// Time Constants
const MINUTE = 60 * 1000 // In ms
const HOUR = MINUTE * 60
const DAY = HOUR * 24

const time_interval_to_ms  = {
  '1m'  : MINUTE,
  '3m'  : MINUTE * 3,
  '5m'  : MINUTE * 5,
  '15m' : MINUTE * 15,
  '30m' : MINUTE * 30,
  '1h'  : HOUR,
  '2h'  : HOUR * 2,
  '4h'  : HOUR * 4,
  '6h'  : HOUR * 6,
  '8h'  : HOUR * 8,
  '12h' : HOUR * 12,
  '1d'  : DAY,
  '3d'  : DAY * 3,
  '1w'  : DAY * 7,
  '1M'  : DAY * 30
}

const convertToOhlvc = (data) => {
  return ({
    start_time: data[0],
    open: Decimal(data[1]),
    high: Decimal(data[2]),
    low: Decimal(data[3]),
    close: Decimal(data[4]),
    end_time: data[6],
    emas: {}
  })
}

const DownloadHistoricalData = (props) => {
  const { statusState, logState, tokenDataState, configState } = useContext(GlobalContext);
  const [status, setStatus] = statusState;
  const [config, setConfig] = configState;
  const [tokenData, setTokenData] = tokenDataState;
  const [logs, setLogs] = logState;

  const send_request = (request) => {
    return new Promise(resolve => {
      const tempTokenData = tokenData;
      
      // Initialize with empty data
      tempTokenData[request.token] = tokenData[request.token] || {};
      tempTokenData[request.token]['current_price'] = tempTokenData[request.token]['current_price'] || null;
      tempTokenData[request.token][request.time_interval] = tempTokenData[request.token][request.time_interval] || [];
          
      setTimeout(() => {
        const url = `https://api.binance.com/api/v3/klines?symbol=${request.token}&interval=${request.time_interval}&startTime=${Date.now() - request.interval_ms}&limit=1000`;
        
        // Actually download the historical data
        axios.get(url).then(data => {
          const partial_data = (data.data).map(e => convertToOhlvc(e));

          // Append new data to previously downloaded data ( if any )
          const new_data = [...tempTokenData[request.token][request.time_interval], ...partial_data];
          tempTokenData[request.token][request.time_interval] = new_data;

          // Update token data state
          setTokenData(tempTokenData);

          resolve()
        })
      // Be kind to api ( 1200 weight per minute )
      // Weights:
      //  5, 10, 20, 50, 100 : 1
      //  500	               : 5
      //  1000  	           : 10
      //  5000 	             : 50
      }, 350);
    })
  }

  // Calculate emas for historical data
  const calc_historical_emas = (tokens, timeIntervals, emaIntervals) => {
    setLogs((oldLogs) => [...oldLogs, {date: new Date(), message: `Calculating EMAs for historical data...`}])

    tokens.forEach(token => {
      timeIntervals.forEach(time_interval => {
        const interval_data = tokenData[token][time_interval];
      
        // Add emas for each ohlvc
        interval_data.forEach(ohlvc => {

          // For each ema interval
          emaIntervals.forEach(ema_interval => {
            const ohlvc_index = interval_data.indexOf(ohlvc);
            ohlvc['emas'][ema_interval] = 0;

            // Calculate SMA for last x (ema_interval) closing prices
            if (ohlvc_index === ema_interval-1) {

              // Extract closing prices from specified interval
              const closing_prices = interval_data.slice(0, ema_interval).map(e => e.close);
              const new_sma = closing_prices.reduce((a, b) => Decimal(a).plus(Decimal(b)), 0).div(Decimal(ema_interval));

              // Append SMA for current ema interval
              ohlvc['emas'][ema_interval] = new_sma;
            } 
            
            // Else, caclulate EMA as usual
            else if (ohlvc_index >= ema_interval) {
              const current_price = ohlvc.close;
              const prev_ema = interval_data[ohlvc_index-1]['emas'][ema_interval];
              const k = Decimal(2).div(Decimal(ema_interval).plus(1));
              const new_ema = current_price.times(k).plus(prev_ema.times(Decimal(1).minus(k)));

              // Append new EMA for current ema interval
              ohlvc['emas'][ema_interval] = new_ema;
            }
          })
        })
      })
    })
    setLogs((oldLogs) => [...oldLogs, {date: new Date(), message: 'Done!'}])
  }

  // Queue requests for every interval and token in chunks
  const queue_requests = (tokens, timeIntervals, emaIntervals, precision) => {
      // Max ema interval ( for optimized downloads )
      const max_ema_interval = Math.max.apply(Math, emaIntervals);

      const tempTokenData = tokenData;
      const temp_requests_queue = [];

      tokens.forEach(token => {
        timeIntervals.forEach(time_interval => {

          // Amount of klines left to download
          let data_left = max_ema_interval + precision;

          // Queue urls
          while (data_left > 0) {
            // Calc amount of milliseconds to download for current chunk
            const interval_ms = time_interval_to_ms[time_interval] * (data_left > 0 ? data_left : (max_ema_interval + precision) % 1000);

            temp_requests_queue.push({token: token, time_interval: time_interval, interval_ms: interval_ms})
            data_left -= 1000;
          } 
        })
      })

    return temp_requests_queue;
  }

  useEffect(() => {
    // Config variables
    const tokens = config.watchlist.map(e => e.toUpperCase());
    const timeIntervals = config.time_intervals;
    const emaIntervals = config.ema_intervals;
    const precision = config.precision;

    // Hold requests to be fetched later
    setLogs((oldLogs) => [...oldLogs, {date: new Date(), message: `Queuing downloads...`}])
    const requests_queue = queue_requests(tokens, timeIntervals, emaIntervals, precision);
    const tokens_to_download = [...tokens];
    
    // Fetch Data recursively
    const fetch_data = () => {
      return new Promise(resolve => {
        const request = requests_queue.shift();
        const r_token = request.token;

        // Log once per token
        if (tokens_to_download.indexOf(r_token) != -1) {
          tokens_to_download.splice(tokens_to_download.indexOf(r_token), 1);
          setLogs((oldLogs) => [...oldLogs, {date: new Date(), loading: true, message: `Downloading historical data for ${r_token}...`}]);
        }
        send_request(request, tokenData, setTokenData).then(() => {
          requests_queue.length > 0 ? fetch_data().then(resolve) : resolve();
        })
      })
    }

    // Finish
    fetch_data().then(() => {
      
      // Calculate historical emas
      calc_historical_emas(tokens, timeIntervals, emaIntervals);
    
      setStatus('running');
    });

  }, [])
  return null;
}

export default DownloadHistoricalData;
