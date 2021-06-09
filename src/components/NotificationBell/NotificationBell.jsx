import styles from './styles.module.scss';
import Text from '../Text/Text.jsx';
import { ReactComponent as BellSvg } from '../../assets/notification.svg';
import { GlobalContext } from '../GlobalContext.jsx';
import { useState, useContext } from 'react';

const NotificationBell = (props) => {
  const { priceState, alertState } = useContext(GlobalContext);
  const [alertPopout, setAlertPopout] = useState(true);
  const [prices, setPrices] = priceState;
  const [alerts, setAlerts] = alertState;

  const handleClick = () => {
    setAlertPopout(!alertPopout);
    console.log(alertPopout);
  }

  return (
    <>
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
