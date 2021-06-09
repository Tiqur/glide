import styles from './styles.module.scss';
import Text from '../Text/Text.jsx';
import { ReactComponent as BellSvg } from '../../assets/notification.svg';
import { GlobalContext } from '../GlobalContext.jsx';
import { useState, useContext } from 'react';

const Notification = (props) => {
  return (
    <div className={styles.notificationMessageContainer}>
      <div className={styles.notificationMessageContent}>
        <Text>4EMA: {props.token}</Text>
      </div>
      <div className={styles.notificationCloseButton}/>
    </div>
  )
}

const NotificationBell = (props) => {
  const { priceState, alertState } = useContext(GlobalContext);
  const [alertPopout, setAlertPopout] = useState(false);
  const [prices, setPrices] = priceState;
  const [alerts, setAlerts] = alertState;

  const handleClick = () => {
    setAlertPopout(!alertPopout);
    console.log(alertPopout);
  }

  return (
    <>
      { alertPopout && 
        <>
          <div onClick={() => {setAlertPopout(false)}}className={styles.notificationPopoutOverlay}/>
          <div className={styles.notificationPopout}>
            <Notification />
            <Notification />
            <Notification />
            <Notification />
          </div>
        </>
      }
      <div onClick={handleClick} className={styles.notificationContainer}>
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
