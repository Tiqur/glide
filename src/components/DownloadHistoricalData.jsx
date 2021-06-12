import axios from 'axios';
import { GlobalContext } from '../components/GlobalContext.jsx';
import { useContext, useEffect } from 'react';

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
    open: parseFloat(data[1]),
    high: parseFloat(data[2]),
    low: parseFloat(data[3]),
    close: parseFloat(data[4]),
    volume: parseFloat(data[5]),
    end_time: data[6]
  })
}

const DownloadHistoricalData = (props) => {
  const { statusState, logState, tokenDataState } = useContext(GlobalContext);
  const [status, setStatus] = statusState;
  const [tokenData, setTokenData] = tokenDataState;
  const [logs, setLogs] = logState;

  const send_request = (request) => {
    return new Promise(resolve => {
      const tempTokenData = tokenData;
      
      // Initialize with empty data
      tempTokenData[request.token] = tokenData[request.token] || {};
      tempTokenData[request.token]['current_price'] = tempTokenData[request.token]['current_price'] || null;
      tempTokenData[request.token][request.time_interval] = tempTokenData[request.token][request.time_interval] || {};
      tempTokenData[request.token][request.time_interval]['ohlvc'] = tempTokenData[request.token][request.time_interval]['ohlvc'] || [];
          
      setTimeout(() => {
        const url = `https://api.binance.com/api/v3/klines?symbol=${request.token}&interval=${request.time_interval}&startTime=${Date.now() - request.interval_ms}&limit=1000`;
        
        // Actually download the historical data
        axios.get(url).then(data => {
          const partial_data = (data.data).map(e => convertToOhlvc(e));

          // Append new data to previously downloaded data ( if any )
          const new_data = [...tempTokenData[request.token][request.time_interval]['ohlvc'], ...partial_data];
          tempTokenData[request.token][request.time_interval]['ohlvc'] = new_data;

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
        const temp_ohlvc = interval_data['ohlvc'];

        emaIntervals.forEach(ema_interval => {
          tokenData[token][time_interval][ema_interval] = tokenData[token][time_interval][ema_interval] || [];
          const temp_emas = tokenData[token][time_interval][ema_interval];

          // Extract closing prices from specified interval
          const closing_prices = temp_ohlvc.map(e => e.close);

          // Calculate SMA for first range, then delete from list to avoid using data from future
          const data_range = closing_prices.slice(0, ema_interval);
          const new_sma = data_range.reduce((a, b) => a + b, 0) / ema_interval;
          temp_emas.push(new_sma);

          // List without the first (sma) elements
          const new_data_range = closing_prices.slice(ema_interval, closing_prices.length);
          
          for (let i=0; i < new_data_range.length-1; i++) {
            // Calculate ema
            const current_price = new_data_range[i];
            const prev_ema = temp_emas[temp_emas.length-1];
            const k = 2 / (ema_interval + 1);
            temp_emas.push(current_price * k + prev_ema * (1 - k));
          }
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
    const tokens = ['DOGEUSDT', 'MATICUSDT', 'BTCUSDT', 'ETHUSDT'];
    const timeIntervals = ['1m', '3m', '5m'];
    const emaIntervals = [9, 13, 21, 55];
    const precision = 1000;

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
