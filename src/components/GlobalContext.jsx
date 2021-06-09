import { useState, createContext, useEffect } from 'react';
import { w3cwebsocket as W3WebSocket } from 'websocket';
const ws = new W3WebSocket('ws://localhost:5000');
const GlobalContext = createContext();

const GlobalProvider = (props) => {
  const [prices, setPrices] = useState({});
  const [alerts, setAlerts] = useState([{token: 'doge', interval: '5m', ema4: 'yes'}]);
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
      setAlerts([...alerts, {token: data['token'], interval: data['interval'], time: data['time'], ema4: data['4ma']}])
    }
  }
 
  return (
    <GlobalContext.Provider value={{priceState: [prices, setPrices], alertState: [alerts, setAlerts]}}>
      {props.children}
    </GlobalContext.Provider>
  )
}

export { GlobalContext, GlobalProvider }

