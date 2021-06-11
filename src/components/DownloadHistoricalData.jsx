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


const DownloadHistoricalData = (props) => {
  const { statusState, logState, tokenDataState } = useContext(GlobalContext);
  const [status, setStatus] = statusState;
  const [tokenData, setTokenData] = tokenDataState;
  const [logs, setLogs] = logState;

  const emulate_request = (request) => {
    return new Promise(resolve => {
      const tempTokenData = tokenData;
      setTimeout(() => {
        const url = `https://api.binance.com/api/v3/klines?symbol=${request.token}&interval=${request.time_interval}&startTime=${Date.now() - request.interval_ms}&limit=1000`;
        console.log(url)

        // Update token data state
        tempTokenData[request.token][request.time_interval] = 1;
        setTokenData(tempTokenData);

        resolve()
      }, 350);
    })
  }

  // Queue requests for every interval and token in chunks
  const queue_requests = (tokens, timeIntervals, emaIntervals, precision) => {

      // Max ema interval ( for optimized downloads )
      const max_ema_interval = Math.max.apply(Math, emaIntervals);

      const tempTokenData = tokenData;

      const temp_requests_queue = [];

      tokens.forEach(token => {
        tempTokenData[token] = {};
        timeIntervals.forEach(time_interval => {

          // Amount of klines left to download
          let data_left = max_ema_interval + precision;

          // Calc amount of milliseconds to download for current chunk
          const interval_ms = time_interval_to_ms[time_interval] * data_left;

          while (data_left > 0) {
            temp_requests_queue.push({token: token, time_interval: time_interval, interval_ms: interval_ms})
            data_left -= 1000;
          } 
        })
      })

    setTokenData(temp_requests_queue);
    return temp_requests_queue;
  }

  useEffect(() => {
    // Config variables
    const tokens = ['DOGEUSDT', 'MATICUSDT', 'ADAUSDT'];
    const timeIntervals = ['1m', '3m']
    const emaIntervals = [9, 13, 21, 55];
    const precision = 1000;

    // Hold requests to be fetched later
    setLogs((oldLogs) => [...oldLogs, {date: new Date(), message: `Queuing downloads...`}])
    const requests_queue = queue_requests(tokens, timeIntervals, emaIntervals, precision);
    
    // Fetch Data recursively
    const fetch_data = () => {
      return new Promise(resolve => {
        const request = requests_queue.shift();
        setLogs((oldLogs) => [...oldLogs, {date: new Date(), message: `Fetching historical data for ${request.token} Time Interval: ${request.time_interval}`}])
        emulate_request(request, tokenData, setTokenData).then(() => {
          requests_queue.length > 0 ? fetch_data().then(resolve) : resolve();
        })
      })
    }
    fetch_data().then(() => {
      setStatus('running');
      console.log(tokenData)
    });


  }, [])
  return null;
}

export default DownloadHistoricalData;
