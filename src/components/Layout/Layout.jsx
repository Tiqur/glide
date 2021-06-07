import styles from './styles.module.css';
import React, { useState, useEffect } from 'react';


const Layout = (props) => {
  const [width, setWidth] = useState(window.innerWidth);
  
  const setInnerWidth = () => {
      setWidth(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener('resize', setInnerWidth);

    return () => {
      window.removeEventListener('resize', setInnerWidth);
    }
  }, [])
  
  return (
    <div className={styles.container}>
      <div style={{width: window.innerWidth - 50}}>
        {props.children}
      </div>
    </div>
  )
}

export default Layout;

