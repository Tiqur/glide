import styles from './styles.module.scss';
import NavBar from '../../components/NavBar/NavBar.jsx';
import Editor from "react-simple-code-editor";
import { useState, useContext, useEffect, useRef } from 'react';
import { highlight, languages } from 'prismjs/components/prism-core';
import { GlobalContext } from '../../components/GlobalContext.jsx';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-tomorrow.css';
import Text from '../../components/Text/Text.jsx';


const Dashboard = () => {
  const { configState, logState, tokenDataState } = useContext(GlobalContext);
  const [config, setConfig] = configState;
  const [tokenData, setTokenData] = tokenDataState;
  const [logs, setLogs] = logState;
  const logsContainerRef = useRef(null);

  const logElements = logs.map(e => {
    const date = e.date;
    const msg = e.message;
    const dateMessage = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
    const timeMessage = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    return <Text key={logs.indexOf(e)}>[{dateMessage} {timeMessage}] {msg}</Text>
  })

  useEffect(() => {
    // Auto scroll to bottom
    logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
  }, [logs])


  return (
    <>
      <NavBar />
      <div className={styles.mainContainer}>
        <div className={styles.editorArea}>
          <Editor
            value={JSON.stringify(tokenData, null, 4)}
            onValueChange={(code) => setConfig(code)}
            highlight={(code) => highlight(code, languages.js)}
            padding={10}
            style={{
              fontFamily: '"Roboto", "Fira Mono", monospace',
              fontSize: 20,
            }}
          />
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
