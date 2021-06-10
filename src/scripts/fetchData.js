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


// Class specific to each token
// Holds Interval instances for each time interval
class Token {
  constructor() {
    this.token = token;
    this.precision = precision;
    this.ema_ranges = ema_ranges;
    this.time_ranges = time_ranges;
    this.time_interval_instances = []''
  }
}


const fetchData = async (props) => {
  const symbols = props.symbol;
  const intervals = props.interval;
  const rangeInDays = props.rangeInDays
  
  // Interval ( in seconds ) * amount of days
  const range = rangeInDays * intervalSecMap[interval];

  // Download data
  const res = await axios.get(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&startTime=${range}`)

  // Convert to json
  const data = await res.json()
  console.log(data)
}
