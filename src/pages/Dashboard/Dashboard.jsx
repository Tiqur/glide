import styles from './styles.module.scss';
import NavBar from '../../components/NavBar/NavBar.jsx';
import Editor from "react-simple-code-editor";
import { useState, useContext } from 'react';
import { highlight, languages } from 'prismjs/components/prism-core';
import { GlobalContext } from '../../components/GlobalContext.jsx';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-tomorrow.css';


const Dashboard = () => {
  const { configState } = useContext(GlobalContext);
  const [config, setConfig] = configState;

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
        </div>
      </div>
    </>
  )
}

export default Dashboard;
