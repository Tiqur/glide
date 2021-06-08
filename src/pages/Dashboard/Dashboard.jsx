import styles from './styles.module.scss';
import NavBar from '../../components/NavBar/NavBar.jsx';
import Chart from '../../components/Chart/Chart.jsx';


const Dashboard = () => {
  const width = Math.round(window.innerWidth * 0.7);
  const height = Math.round(width / 1.777777);

  console.log(height, width)
  return (
    <>
      <NavBar />
      <div className={styles.contentContainer}>
        <Chart width={width} height={height} symbol='DOGE'/>
        <div className={styles.settingsContainer}/>
      </div>
    </>
  )
}

export default Dashboard;
