import styles from './styles.module.scss';
import NavBar from '../../components/NavBar/NavBar.jsx';
import Editor from "react-simple-code-editor";
import { useState, useContext } from 'react';
import { highlight, languages } from 'prismjs/components/prism-core';
import { GlobalContext } from '../../components/GlobalContext.jsx';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-tomorrow.css';
import Text from '../../components/Text/Text.jsx';


const Dashboard = () => {
  const { configState, logState } = useContext(GlobalContext);
  const [config, setConfig] = configState;
  const [logs, setLogs] = logState;


  return (
    <>
      <NavBar />
      <div className={styles.mainContainer}>
        <Editor
          className={styles.editor}
          value={config}
          onValueChange={(code) => setConfig(code)}
          highlight={(code) => highlight(code, languages.js)}
          padding={10}
          style={{
            fontFamily: '"Roboto", "Fira Mono", monospace',
            fontSize: 20,
          }}
        />
        <div className={styles.logsContainer}>
          {logs.map(e => {
            <Text>{e}</Text>
          })}
        </div>
        <div className={styles.statisticsContainer}>
        </div>
      </div>
    </>
  )
}

export default Dashboard;
