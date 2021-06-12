import { w3cwebsocket as W3CWebSocket } from "websocket";
import { GlobalContext } from '../components/GlobalContext.jsx';
import { useContext, useEffect } from 'react';

const OpenWebsockets = () => {
  const { logState, tokenDataState } = useContext(GlobalContext);
  const [logs, setLogs] = logState;
  const [tokenData, setTokenData] = tokenDataState;

  useEffect(() => {
    setLogs((oldLogs) => [...oldLogs, {date: new Date(), loading: true, message: 'Initializing websocket connections...'}]);
    // URL connection
    const ws = new WebSocket('wss://stream.binance.com:9443/ws');

    ws.onopen = () => {
        ws.send(JSON.stringify({
          method: 'SUBSCRIBE',
          params: ['dogeusdt', 'maticusdt', 'btcusdt', 'ethusdt'].map(e => e + '@miniTicker'),
          id: 1
        }));
    }

    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      const [token, current_price, time] = [data.s, parseFloat(data.c), data.E];

      // Update current price in token data state
      if (token in tokenData) {
        tokenData[token]['current_price'] = current_price;
      }
    }
  }, [])


  return null;
}

export default OpenWebsockets;
