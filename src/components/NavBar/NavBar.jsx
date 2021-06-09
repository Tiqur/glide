import styles from './styles.module.scss';
import { useContext } from 'react';
import Text from '../../components/Text/Text.jsx';
import NotificationBell from '../../components/NotificationBell/NotificationBell.jsx';
import { ReactComponent as PigeonLogo } from '../../assets/pigeon.svg';
import { GlobalContext } from '../GlobalContext.jsx';

const NavBar = () => {
  const { priceState, alertState } = useContext(GlobalContext);
  const [prices, setPrices] = priceState;
  const [alerts, setAlerts] = alertState;

  return (
    <div className={styles.container}>
      <PigeonLogo className={styles.logo}/>
      <div className={styles.content}>
        <input className={styles.searchBar}/>
        <Text margin='1em 1.5em 0.6em 1em' padding='0 0 0.4em 0'underline>Dashboard</Text>
        <Text margin='1em 1.5em 0.6em 1em' padding='0 0 0.4em 0'underline>Charts</Text>
        <Text margin='1em 1.5em 0.6em 1em' padding='0 0 0.4em 0'underline>Logs</Text>
        <NotificationBell state={alerts.length}/>
      </div>
    </div>
  )
}

export default NavBar;
