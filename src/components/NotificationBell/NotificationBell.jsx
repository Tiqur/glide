import styles from './styles.module.scss';
import Text from '../Text/Text.jsx';
import { ReactComponent as BellSvg } from '../../assets/notification.svg';
import { GlobalContext } from '../GlobalContext.jsx';
import { useState, useContext } from 'react';
import { Portal } from 'react-portal';
import { Link } from 'react-router-dom';


const NotificationBell = (props) => {
  const { priceState, alertState } = useContext(GlobalContext);
  const [alertPopout, setAlertPopout] = useState(false);
  const [prices, setPrices] = priceState;
  const [alerts, setAlerts] = alertState;

  const removeElement = (index) => {
    setAlerts(alerts.filter((o) => {
      return alerts.indexOf(o) !== index;
    }))
  }

  const Notification = (props) => {
    return (
      <div className={styles.notificationMessageContainer}>
        <Link to={{pathname: '/trade', search: '?token='+props.token}}>
      <div onClick={() => {
        removeElement(props.index)
        setAlertPopout(false)
      }} className={styles.notificationMessageContent}>
            <Text>Token: {props.token}</Text>
            <Text>Interval: {props.interval}</Text>
            <Text>4ema: {props.ema4}</Text>
          </div>
        </Link>
      <div onClick={() => {
        removeElement(props.index)
      }} className={styles.notificationCloseButton}/>
      </div>
    )
  }

  return (
    <>
      { alertPopout && 
        <Portal node={document && document.getElementById('root')}>
          <div onClick={() => {setAlertPopout(false)}} className={styles.notificationPopoutOverlay}/>
          <div className={styles.notificationPopout}>
            {alerts.map(e => <Notification index={alerts.indexOf(e)} time={e.time} token={e.token} interval={e.interval} ema4={e.ema4}/> )}
          </div>
        </Portal>
      }
      <div onClick={() => {setAlertPopout(true)}} className={styles.notificationContainer}>
        <BellSvg className={styles.bell}/>
        { alerts.length > 0 &&
          <div className={styles.badge}>
            <Text color='white' size={1.4}>{alerts.length}</Text>
          </div>
        }
      </div>
    </>
  )
}

export default NotificationBell;
