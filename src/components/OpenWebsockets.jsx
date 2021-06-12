import { w3cwebsocket as W3CWebSocket } from "websocket";
import { GlobalContext } from '../components/GlobalContext.jsx';
import { useContext, useEffect } from 'react';

const OpenWebsockets = () => {
  const { logState } = useContext(GlobalContext);
  const [logs, setLogs] = logState;

  useEffect(() => {
    setLogs((oldLogs) => [...oldLogs, {date: new Date(), loading: true, message: 'Initializing websocket connections...'}]);
    // URL connection
    const ws = new WebSocket('wss://stream.binance.com:9443/ws');

    ws.onopen = () => {
        ws.send(JSON.stringify({
          method: 'SUBSCRIBE',
          params: ['dogeusdt', 'maticusdt'].map(e => e + '@miniTicker'),
          id: 1
        }));
    }

    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      console.log(data);
    }
  }, [])


  return null;
}

export default OpenWebsockets;
