import styles from './styles.module.scss';
import Text from '../../components/Text/Text.jsx';
import { useContext } from 'react';
import NotificationBell from '../../components/NotificationBell/NotificationBell.jsx';
import { ReactComponent as PigeonLogo } from '../../assets/pigeon.svg';
import { ReactComponent as StartSvg } from '../../assets/power.svg';
import { GlobalContext } from '../GlobalContext.jsx';
import LoadingSpin from 'react-loading-spin';
import DownloadHistoricalData from '../DownloadHistoricalData.jsx';


const NavLink = (props) => {
  return(<Text margin='1em 1.5em 0.6em 1em' padding='0 0 0.4em 0' underline>{props.text}</Text>)
}

const NavBar = () => {
  const { statusState } = useContext(GlobalContext);
  const [status, setStatus] = statusState;

  const handleStatusClick = () => {
    if (status == 'idle') {
      setStatus('loading');
      setTimeout(() => {
        setStatus('running')
      }, 2000)
    } else if (status == 'running') {
      setStatus('loading')
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
        return <LoadingSpin primaryColor='#05AC70' secondaryColor='#161A25' size='1.55em'/>
        break;
      case "running":
        return <StartSvg fill='#AB3323' onClick={handleStatusClick} className={styles.startStop}/>
        break;

    }
  }

  return (
    <div className={styles.container}>
      { status == 'running' && 
        <DownloadHistoricalData />
      }
      <div className={styles.logoContainer}>
        <div className={styles.centerText}>
          <PigeonLogo className={styles.logo}/>
          <Text size={3}>Glide</Text>
        </div>
      </div>
      <div className={styles.content}>
        <NavLink text='Dashboard'/>
        <NavLink text='Charts'/>
        <NavLink text='Trade'/>
        <NavLink text='Logs'/>

        <StatusButton/>

        <NotificationBell />
      </div>
    </div>
  )
}

export default NavBar;
