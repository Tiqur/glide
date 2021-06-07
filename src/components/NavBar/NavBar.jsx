import styles from './styles.module.scss';

const NavBar = () => {
  return (
    <div className={styles.container}>
      <p className={styles.hover_underline_animation}>Dashboard</p>
      <p className={styles.hover_underline_animation}>Charts</p>
      <p className={styles.hover_underline_animation}>Logs</p>
    </div>
  )
}

export default NavBar;
