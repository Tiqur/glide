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


// Queue requests for every interval and token in chunks
const queue_requests = (tokens, timeIntervals, emaIntervals, precision) => {

    // Max ema interval ( for optimized downloads )
    const max_ema_interval = Math.max.apply(Math, emaIntervals);

    const temp_requests_queue = [];

    tokens.forEach(token => {
      timeIntervals.forEach(time_interval => {

        // Amount of klines left to download
        let data_left = max_ema_interval + precision;

        // Calc amount of milliseconds to download for current chunk
        const interval_ms = time_interval_to_ms[time_interval] * data_left;

        while (data_left > 0) {
          const request = `https://api.binance.com/api/v3/klines?symbol=${token}&interval=${time_interval}&startTime=${Date.now() - interval_ms}&limit=1000`;
          temp_requests_queue.push(request)
          data_left -= 1000;
        } 
      })
    })

  return temp_requests_queue;
}



const DownloadHistoricalData = (props) => {
  const { statusState, logState } = useContext(GlobalContext);
  const [logs, setLogs] = logState;

  useEffect(() => {
    setLogs([...logs, {date: new Date(), message: 'Queuing downloads...'}])

    // Config variables
    const tokens = ['DOGEUSDT', 'MATICUSDT', 'ADAUSDT']
    const timeIntervals = ['1m', '3m']
    const emaIntervals = [9, 13, 21, 55];
    const precision = 1000;

    // Hold requests to be fetched later
    const requests_queue = queue_requests(tokens, timeIntervals, emaIntervals, precision);
    
  }, [])
  return null;
}

export default DownloadHistoricalData;
