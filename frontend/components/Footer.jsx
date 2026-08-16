import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div>
          <div className={styles.brand}>
            <span className={styles.dot} />
            MANOBHAV <span className={styles.ai}>AI</span>
          </div>
          <p className={styles.tagline}>Understanding emotions through AI.</p>
        </div>

        <div className={styles.links}>
          
          <a href="https://github.com/lakshay-aggarwal-codes" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/lakshay-aggarwal-44443b336/" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </div>
      </div>

      <div className={styles.bottom}>
        <span>© {new Date().getFullYear()} Manobhav AI. Built for learning, research, and demonstration.</span>
      </div>
    </footer>
  );
}
