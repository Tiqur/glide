import axios from 'axios';
import { GlobalContext } from '../components/GlobalContext.jsx';
import { useContext, useEffect } from 'react';


const DownloadHistoricalData = (props) => {
  const { statusState, logState } = useContext(GlobalContext);
  const [logs, setLogs] = logState;

  useEffect(() => {
    const tokens = ['DOGEUSDT', 'MATICUSDT'];
    const timeIntervals = ['1m', '5m'];
    const emaIntervals = [9, 13, 21, 55];
    const max_interval = Math.max(emaIntervals);
    const precision = 1000;
    
    // Hold requests to be fetched later
    const requests_queue = [];

    tokens.forEach(token => {
      timeIntervals.forEach(time_interval => {
        console.log(token, time_interval)
      })
    })

    
  }, [])
  return null;
}

export default DownloadHistoricalData;
