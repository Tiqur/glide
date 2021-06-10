import axios from 'axios';
import { useEffect } from 'react';

const MINUTE = 60
const HOUR = MINUTE * 60
const DAY = HOUR * 24

const intervalSecMap  = {
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

class Ohlvc {
  constructor(data) {
    this.start_time = parseFloat(data[0]);
    this.open = parseFloat(data[1]);
    this.high = parseFloat(data[2]);
    this.low = parseFloat(data[3]);
    this.close = parseFloat(data[4]);
    this.volume = parseFloat(data[5]);
    this.end_time = parseFloat(data[6]);
  }
}

class TimeInterval {
  constructor(interval) {
    this.candle_time_interval = interval;
    this.moving_average_instances = [];
    this.last_4ma = [];
    this.first = true;
  }
}

class MovingAverageInterval {
  constructor(ma_interval) {
    this.ma_interval = ma_interval;
    this.ohlcv = [];
    this.emas = [];
  }

  calcEmas() {
    // Extract closing prices from specified interval
    const closing_prices = this.ohlcv.map(e => e.close);
  
    // Calculate SMA for first range, then delete from list to avoid using data from future
    const data_range = closing_prices.slice(0, this.ma_interval);

    // Calculate sma
    const new_sma = data_range.reduce((a, b) => a + b, 0);
    this.emas.push(new_sma);

    // List without the first (ma) elements
    const new_data_range = closing_prices.slice(this.ma_interval, closing_prices.length);

    for (let i=0; i < new_data_range.length-1; i++) {
      // Calculate ema
      const current_price = new_data_range[i];
      const prev_ema = this.emas[this.emas.length-1];
      const window = this.ma_interval;
    
      const k = 2 / (window + 1);
      this.emas.push(current_price * k + prev_ema * (1 - k));
      
    }
  }
}


// Class specific to each token
// Holds Interval instances for each time interval
class Token {
  constructor(token, precision, ema_ranges, time_ranges) {
    this.token = token;
    this.precision = precision;
    this.ema_ranges = ema_ranges;
    this.time_ranges = time_ranges;
    this.time_interval_instances = [];
  }

  async download_history() {
    // Download data for each time range and moving average range
    this.time_ranges.forEach(async (time_range) => {
      // Initialize interval history
      const ih = new TimeInterval(time_range);
      
      // Emas rely on previous emas.  Calculate extra for more precision.
      const download_range = Math.max.apply(Math, this.ema_ranges) + this.precision;
      
      // Fetch historical data
      let historical_data = [];

      // Download data in chunks ( mostly for if precision + max ema range is greater than 1000 )
      let download_range_index = download_range;

      while (download_range_index > 0) {

        // Calc amount of milliseconds to download for current chunk
        const interval_ms = intervalSecMap[time_range] * download_range_index * 1000;
        
        const partial_data = (await axios.get(`https://api.binance.com/api/v3/klines?symbol=${this.token}&interval=${time_range}&startTime=${Date.now() - interval_ms}&limit=1000`)).data;
        historical_data = [...historical_data, ...partial_data];

        download_range_index -= partial_data.length;
      }

      //console.log(historical_data.length)

      // Optimize downloads by only downloading the necessary data per token
      this.ema_ranges.forEach(ma_range => {

        // Initialize moving average interval instance
        const mai = new MovingAverageInterval(ma_range);

        // new data range
        const new_range = historical_data.slice(-(ma_range + this.precision));

        // Organize data
        new_range.forEach(data => {
          mai.ohlcv.push(new Ohlvc(data))
        })

        // Append moving average instance to TimeInterval
        ih.moving_average_instances.push(mai);
      })

      this.time_interval_instances.push(ih);

    })
  }
}

const DownloadHistoricalData = (props) => {
  useEffect(() => {
    const tokens = ['DOGEUSDT']; const timeIntervals = ['1m', '5m'];
    const emaIntervals = [9, 13, 21, 55];
    const precision = 1000;

    tokens.forEach(token => {
      const newToken = new Token(token, precision, emaIntervals, timeIntervals);
      newToken.download_history();
    })
  })
  return (
    <>
    </>
  )
}

export default DownloadHistoricalData;
