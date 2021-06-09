import styles from './styles.module.scss';
import Text from '../Text/Text.jsx';
import { ReactComponent as BellSvg } from '../../assets/notification.svg';

const NotificationBell = (props) => {
  return (
    <div className={styles.notificationContainer}>
      <BellSvg className={styles.bell}/>
      { props.state > 0 &&
        <div className={styles.badge}>
          <Text size={1.4}>{props.state}</Text>
        </div>
      }
    </div>
  )
}

export default NotificationBell;
