import styles from './styles.module.scss';
import NavBar from '../../components/NavBar/NavBar.jsx';
import Chart from '../../components/Chart/Chart.jsx';


const Dashboard = () => {
  return (
    <>
      <NavBar />
      <div className={styles.contentContainer}>
        <Chart symbol='DOGE'/>
        <div className={styles.settingsContainer}/>
      </div>
    </>
  )
}

export default Dashboard;
