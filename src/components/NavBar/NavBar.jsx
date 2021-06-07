import styles from './styles.module.scss';
import Text from '../../components/Text/Text.jsx';

const NavBar = () => {
  return (
    <div className={styles.container}>
      <Text padding='1em' underline>Dashboard</Text>
      <Text padding='1em' underline>Charts</Text>
      <Text padding='1em' underline>Logs</Text>
    </div>
  )
}

export default NavBar;
