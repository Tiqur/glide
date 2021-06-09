import styles from './styles.module.scss';
import Text from '../Text/Text.jsx';
import { ReactComponent as BellSvg } from '../../assets/notification.svg';
import { GlobalContext } from '../GlobalContext.jsx';
import { useState, useContext } from 'react';
import { Portal } from 'react-portal';


const NotificationBell = (props) => {
  const { priceState, alertState } = useContext(GlobalContext);
  const [alertPopout, setAlertPopout] = useState(false);
  const [prices, setPrices] = priceState;
  const [alerts, setAlerts] = alertState;

  const Notification = (props) => {
    return (
      <div className={styles.notificationMessageContainer}>
        <div className={styles.notificationMessageContent}>
          <Text>Token: {props.token}</Text>
          <Text>Interval: {props.interval}</Text>
          <Text>4ema: {props.ema4}</Text>
        </div>
      <div onClick={() => {
        setAlerts(alerts.filter((o) => {
          return o.time !== props.time;
        }))
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
            {alerts.map(e => <Notification time={e.time} token={e.token} interval={e.interval} ema4={e.ema4}/> )}
          </div>
        </Portal>
      }
      <div onClick={() => {setAlertPopout(true)}} className={styles.notificationContainer}>
        <BellSvg className={styles.bell}/>
        { alerts.length > 0 &&
          <div className={styles.badge}>
            <Text size={1.4}>{alerts.length}</Text>
          </div>
        }
      </div>
    </>
  )
}

export default NotificationBell;
