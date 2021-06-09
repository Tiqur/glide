import styles from './styles.module.scss';
import NavBar from '../../components/NavBar/NavBar.jsx';


const Dashboard = () => {
  return (
    <>
      <NavBar />
      <div className={styles.mainContainer}>
        <div className={styles.settingsContainer}>

        </div>
      </div>
    </>
  )
}

export default Dashboard;
