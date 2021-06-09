import styles from './styles.module.scss';
import Text from '../../components/Text/Text.jsx';
import NotificationBell from '../../components/NotificationBell/NotificationBell.jsx';
import { ReactComponent as PigeonLogo } from '../../assets/pigeon.svg';

const NavLink = (props) => {
  return(<Text margin='1em 1.5em 0.6em 1em' padding='0 0 0.4em 0' underline>{props.text}</Text>)
}

const NavBar = () => {

  return (
    <div className={styles.container}>
      <PigeonLogo className={styles.logo}/>
      <div className={styles.content}>
        <input className={styles.searchBar}/>
        <NavLink text='Dashboard'/>
        <NavLink text='Charts'/>
        <NavLink text='Trade'/>
        <NavLink text='Logs'/>
        <NotificationBell />
      </div>
    </div>
  )
}

export default NavBar;
