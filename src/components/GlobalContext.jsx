import { useState, createContext, useEffect } from 'react';
import { w3cwebsocket as W3WebSocket } from 'websocket';
const ws = new W3WebSocket('ws://localhost:5000');
const GlobalContext = createContext();

const GlobalProvider = (props) => {
  const [prices, setPrices] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [logs, setLogs] = useState([]);

  ws.onmessage = (msg) => {
    const data = JSON.parse(msg.data);

    // Update prices 
    if (data['type'] === 'price') {
      const tempPrices = prices;
      tempPrices[data['token']] = data['price'];
      setPrices(tempPrices);

    // Update alerts
    } else if (data['type'] === 'alert') {
      setAlerts([...alerts, {token: data['token'], interval: data['interval'], ema4: data['4ma']}])
    }
  }
 
  return (
    <GlobalContext.Provider value={{prices: [prices, setPrices], alerts: [alerts, setAlerts]}}>
      {props.children}
    </GlobalContext.Provider>
  )
}

export { GlobalContext, GlobalProvider }

