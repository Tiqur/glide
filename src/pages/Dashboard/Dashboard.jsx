import styles from './styles.module.scss';
import NavBar from '../../components/NavBar/NavBar.jsx';
import Chart from '../../components/Chart/Chart.jsx';


const Dashboard = () => {
  return (
    <>
      <NavBar />
      <Chart symbol='doge'/>
    </>
  )
}

export default Dashboard;
