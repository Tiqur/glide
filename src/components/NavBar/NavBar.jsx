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
        <NotificationBell />
      </div>
    </div>
  )
}

export default NavBar;
