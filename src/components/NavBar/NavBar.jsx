import styles from './styles.module.scss';
import Text from '../../components/Text/Text.jsx';
import { ReactComponent as PigeonLogo } from '../../assets/pigeon.svg';

const NavBar = () => {
  return (
    <div className={styles.container}>
      <PigeonLogo className={styles.logo}/>
      <div className={styles.content}>
        <input className={styles.searchBar}/>
        <Text padding='1em 1.5em' underline>Dashboard</Text>
        <Text padding='1em 1.5em' underline>Charts</Text>
        <Text padding='1em 1.5em' underline>Logs</Text>
      </div>
    </div>
  )
}

export default NavBar;
