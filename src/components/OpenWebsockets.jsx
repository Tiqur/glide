import { w3cwebsocket as W3CWebSocket } from "websocket";
import { GlobalContext } from '../components/GlobalContext.jsx';
import { useContext, useEffect } from 'react';

const OpenWebsockets = () => {
  const { logState } = useContext(GlobalContext);
  const [logs, setLogs] = logState;

  useEffect(() => {
    setLogs((oldLogs) => [...oldLogs, {date: new Date(), loading: true, message: 'Opening websocket connections...'}]);

    // Connect to websockets
    const conn = new WebSocket("wss://stream.binance.us:9443/ws");
    conn.onopen = function(evt) {
      conn.send(JSON.stringify({
        method: 'SUBSCRIBE',
        params: ['dogeusdt', 'btcusdt', 'adausdt'].map(e => `${e}@ticker`),
        id: 1
      }));
    }
    conn.onmessage = (msg) => {
      console.log(msg)
    }
  }, [])


  return null;
}

export default OpenWebsockets;
