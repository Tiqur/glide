import styles from './styles.module.scss';
import NavBar from '../../components/NavBar/NavBar.jsx';
import { useState, useContext, useEffect, useRef } from 'react';
import { GlobalContext } from '../../components/GlobalContext.jsx';
import Text from '../../components/Text/Text.jsx';
import ReactJson from 'react-json-view'

const Dashboard = () => {
  const { configState, logState, tokenDataState } = useContext(GlobalContext);
  const [config, setConfig] = configState;
  const [tokenData, setTokenData] = tokenDataState;
  const [logs, setLogs] = logState;
  const logsContainerRef = useRef(null);
  const loadingStates = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

  const logElements = logs.map(e => {
    const date = e.date;
    const msg = e.message;
    const dateMessage = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
    const timeMessage = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    return (
      <Text key={logs.indexOf(e)}>
        <Text inline color='#05AC70'>[<Text inline>{dateMessage} {timeMessage}</Text>]: </Text> 
        {e.loadingState > -1 && 
          <Text inline color='#05AC70'>
            [<Text inline color='white'>{loadingStates[e.loadingState]}</Text>]
          </Text>
        }
        <Text inline color='white'> {msg}</Text>

      </Text>
    ) 
  })

  useEffect(() => {
    // Remove residual loading animation from previous logs
    setLogs((oldLogs) => {
      const temp_logs = oldLogs;

      const allPreviousLoading = logs.map(e => {
        return e.loading && logs.indexOf(e) < logs.length-1 ? logs.indexOf(e) : 0;
      }).filter(e => e != 0);

      allPreviousLoading.forEach(e => {
        temp_logs[e] = {date: temp_logs[e].date, message: temp_logs[e].message, loading: false};
      })
      return temp_logs;
    });


    // Loading animation
    const logLoadingInerval = setInterval(() => {
      const lastLog = logs[logs.length-1] || {};
      // Animate
      if (lastLog.loading) {
        if (!lastLog.loadingState) lastLog.loadingState = 0;
        const newLoadingState = lastLog.loadingState < loadingStates.length-1 ? lastLog.loadingState+1 : 0;
        setLogs((oldLogs) => [...oldLogs.slice(0, oldLogs.length-1), {date: lastLog.date, loading: true, message: lastLog.message, loadingState: newLoadingState}]);
      }
    }, 80)

    // Auto scroll to bottom
    logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;

    // Clear interval
    return () => clearInterval(logLoadingInerval);
  }, [logs])


  return (
    <>
      <NavBar />
      <div className={styles.mainContainer}>
        <div className={styles.editorArea}>
          <ReactJson style={{background: '#242A39'}}collapsed={1} src={tokenData} theme='monokai'/>
        </div>
        <div ref={logsContainerRef} className={styles.logsContainer}>
          {logElements}
        </div>
        <div className={styles.statisticsContainer}>
        </div>
      </div>
    </>
  )
}

export default Dashboard;
