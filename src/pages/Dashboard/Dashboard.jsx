import styles from './styles.module.scss';
import NavBar from '../../components/NavBar/NavBar.jsx';
import Editor from "react-simple-code-editor";
import { useState } from 'react';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-tomorrow.css';


const Dashboard = () => {
  const defaultConfig = `
  {
    "watchlist": [
      "DOGE",
      "MATIC",
      "ETC"
    ],

    "precision": 1000,

    "ema_intervals": [9, 13, 21, 55],

    "time_intervals": [1, 5, 15]
  }`

  const [code, setCode] = useState(defaultConfig);

  return (
    <>
      <NavBar />
      <div className={styles.mainContainer}>
      <Editor
        className={styles.editor}
        value={code}
        onValueChange={(code) => setCode(code)}
        highlight={(code) => highlight(code, languages.js)}
        padding={10}
        style={{
          fontFamily: '"Roboto", "Fira Mono", monospace',
          fontSize: 20,
        }}
      />
      </div>
    </>
  )
}

export default Dashboard;
