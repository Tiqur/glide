import styles from './styles.module.scss';
import Text from '../../components/Text/Text.jsx';
import { useContext } from 'react';
import NotificationBell from '../../components/NotificationBell/NotificationBell.jsx';
import { ReactComponent as PigeonLogo } from '../../assets/pigeon.svg';
import { ReactComponent as StartSvg } from '../../assets/power.svg';
import { GlobalContext } from '../GlobalContext.jsx';
import LoadingSpin from 'react-loading-spin';
import DownloadHistoricalData from '../DownloadHistoricalData.jsx';
import OpenWebsockets from '../OpenWebsockets.jsx';
import { Link } from 'react-router-dom';


const NavLink = (props) => {
  return (
    <Link style={{textDecoration: 'none'}} to={props.to}>
      <Text margin='1em 1.5em 0.6em 1em' padding='0 0 0.4em 0' underline>{props.text}</Text>
    </Link>
  )
}

const NavBar = () => {
  const { statusState, logState, tokenDataState } = useContext(GlobalContext);
  const [status, setStatus] = statusState;
  const [tokenData, setTokenData] = tokenDataState;
  const [logs, setLogs] = logState;

  const handleStatusClick = () => {
    if (status == 'idle') {
      setLogs([...logs, {date: new Date(), message: 'Starting...'}])
      setStatus('starting');
    } else if (status == 'running') {
      setLogs([...logs, {date: new Date(), message: 'Stopping...'}])
      setStatus('loading')
      setTokenData({});
      setTimeout(() => {
        setStatus('idle')
      }, 1000)
    }
  }

  const StatusButton = () => {
    switch (status) {
      case "idle":
        return <StartSvg fill='#05AC70' onClick={handleStatusClick} className={styles.startStop}/>
        break;
      case "loading":
      case "starting":
        return <LoadingSpin primaryColor='#05AC70' secondaryColor='#161A25' size='1.55em'/>
        break;
      case "running":
        return <StartSvg fill='#AB3323' onClick={handleStatusClick} className={styles.startStop}/>
        break;
    }
  }

  return (
    <div className={styles.container}>
      { status === 'starting' && Object.keys(tokenData).length === 0 &&
        <>
          <OpenWebsockets/>
        </>
      }
      <div className={styles.logoContainer}>
        <div className={styles.centerText}>
          <PigeonLogo className={styles.logo}/>
          <Text size={3}>Glide</Text>
        </div>
      </div>
      <div className={styles.content}>
        <NavLink to='/trade' text='Trade'/>
        <NavLink to='/dashboard' text='Dashboard'/>
        <NavLink to='/charts' text='Charts'/>
        <NavLink to='/logs' text='Logs'/>

        <StatusButton/>

        <NotificationBell />
      </div>
    </div>
  )
}

export default NavBar;
