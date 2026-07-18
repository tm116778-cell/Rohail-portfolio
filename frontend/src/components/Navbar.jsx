import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { profile } from '../data/profile';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <a className="brand" href="#top">
          {profile.brand}
        </a>

        <nav className={`nav-links ${open ? 'open' : ''}`}>
          <a href="#about" onClick={() => setOpen(false)}>
            About
          </a>
          <a href="#experience" onClick={() => setOpen(false)}>
            Experience
          </a>
          <a href="#achievements" onClick={() => setOpen(false)}>
            Achievements
          </a>
          <a href="#projects" onClick={() => setOpen(false)}>
            Projects
          </a>
          <a href="#contact" onClick={() => setOpen(false)}>
            Contact
          </a>
          <Link to="/admin" onClick={() => setOpen(false)}>
            Admin
          </Link>
        </nav>

        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
          <button className="icon-btn" type="button" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? '☀' : '☾'}
          </button>
          <button
            className="icon-btn mobile-toggle"
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>
      </div>
    </header>
  );
}
