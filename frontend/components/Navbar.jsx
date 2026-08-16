'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './Navbar.module.css';

const LINKS = [
  { href: '#home', label: 'Home' },
  { href: '#analyze', label: 'Analyze' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#about', label: 'About' },
];

export default function Navbar() {
  const navRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header ref={navRef} className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.inner}`}>
        <a href="#home" className={styles.brand}>
          <span className={styles.dot} />
          MANOBHAV <span className={styles.ai}>AI</span>
        </a>

        <nav className={styles.links}>
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} className={styles.link}>
              {link.label}
            </a>
          ))}
        </nav>

        <a href="#analyze" className={`btn btn-primary ${styles.cta}`}>
          Try Manobhav
        </a>

        <button
          className={styles.menuBtn}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
        </button>
      </div>

      {menuOpen && (
        <div className={styles.mobileMenu}>
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
              {link.label}
            </a>
          ))}
          <a href="#analyze" className="btn btn-primary" onClick={() => setMenuOpen(false)}>
            Try Manobhav
          </a>
        </div>
      )}
    </header>
  );
}
