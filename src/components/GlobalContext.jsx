import { useState, createContext, useEffect } from 'react';
import { w3cwebsocket as W3WebSocket } from 'websocket';
const ws = new W3WebSocket('ws://localhost:5000');
const GlobalContext = createContext();

const GlobalProvider = (props) => {
  const [prices, setPrices] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState('idle');

  ws.onmessage = (msg) => {
    const data = JSON.parse(msg.data);
    const token = data['token'].slice(0, -4);

    // Update prices 
    if (data['type'] === 'price') {
      const tempPrices = prices;
      tempPrices[token] = data['price'];
      setPrices(tempPrices);

    // Update alerts
    } else if (data['type'] === 'alert') {
      setAlerts([...alerts, {token: token, interval: data['interval'], time: data['time'], ema4: data['4ma']}])
    }
  }
 
  return (
    <GlobalContext.Provider value={{statusState: [status, setStatus], priceState: [prices, setPrices], alertState: [alerts, setAlerts]}}>
      {props.children}
    </GlobalContext.Provider>
  )
}

export { GlobalContext, GlobalProvider }

