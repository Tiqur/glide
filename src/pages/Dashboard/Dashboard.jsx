import styles from './styles.module.scss';
import NavBar from '../../components/NavBar/NavBar.jsx';
import Chart from '../../components/Chart/Chart.jsx';


const Dashboard = () => {
  const width = Math.round(window.innerWidth * 0.7);
  const height = Math.round(window.innerHeight * 0.5);

  return (
    <>
      <NavBar />
      <div className={styles.mainContainer}>
        <Chart symbol='DOGE'/>
        <div className={styles.settingsContainer}/>
        <div className={styles.chartCarousel}/>
      </div>
      
    </>
  )
}

export default Dashboard;
