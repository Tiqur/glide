import { useState, createContext, useEffect } from 'react';
const GlobalContext = createContext();

const GlobalProvider = (props) => {
  const [prices, setPrices] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [logs, setLogs] = useState([{date: new Date, message: 'Welcome to Glide! :)'}]);
  const [tokenData, setTokenData] = useState({});
  const [status, setStatus] = useState('idle');
  const [config, setConfig] = useState({
      watchlist: [
        "DOGE",
        "MATIC",
        "ETC"
      ],
      precision: 1000,
      ema_intervals: [9, 13, 21, 55],
      time_intervals: ['1m', '5m', '15m']
});

  return (
    <GlobalContext.Provider value={{tokenDataState: [tokenData, setTokenData], configState: [config, setConfig], statusState: [status, setStatus], priceState: [prices, setPrices], alertState: [alerts, setAlerts], logState: [logs, setLogs]}}>
      {props.children}
    </GlobalContext.Provider>
  )
}

export { GlobalContext, GlobalProvider }

