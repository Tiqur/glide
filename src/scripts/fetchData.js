import axios from 'axios';

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

class TimeInterval {
  constructor(interval) {
    this.candle_time_interval = interval;
    this.moving_average_instances = [];
    this.last_4ma;
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
    closing_prices = #Get all close attributes from ohlcv objects
  
    // Calculate SMA for first range, then delete from list to avoid using data from future
    data_range = closing_prices.slice(0, this.ma_interval);
    this.emas.push(#calcsma(data_range))

    // List without the first (ma) elements
    new_data_range = closing_prices.slice(this.ma_interval, closing_prices.length);

    for (i=0; i < new_data_range.length-1; i++) {
      this.emas.push(#ema(new_data_range[i], this.emas[this.emas.length-1], this.ma_interval));
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

  downloadHistory() {
    // Download data for each time range and moving average range
    time_ranges.forEach(time_range) {
      // Initialize interval history
      ih = TimeInterval(time_range);
      
      // Emas rely on previous emas.  Calculate extra for more precision.
      download_range = Math.max(this.ema_ranges) + this.precision;

      // Convert binance kline to seconds
      interval_sec = intervalSecMap[time_range] * download_range;
      
      // Fetch historical data
      const res = axios.get(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&startTime=${range}`);
      const historical_data = res.json();

      // Optimize downloads by only downloading the necessary data per token
      this.ema_ranges.forEach(ma_range => {

        // Initialize moving average interval instance
        mai = MovingAverageInterval(ma_range);

        // new data range
        new_range = historical_data.slice(-(ma_range + self.precision));

        // Organize data
        new_range.forEach(data => {
          mai.ohlcv.append(Ohlvc(data))
        })

        // Append moving average instance to TimeInterval
        ih.moving_average_instances.append(mai);
      })

      this.time_interval_instances.append(ih);

    }
  }
}


