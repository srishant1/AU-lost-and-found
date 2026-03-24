import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="icon">🔎</span>
          <span>CampusL&F</span>
        </Link>
        <button className="nav-toggle" aria-label="Toggle navigation" onClick={() => setOpen(!open)}>
          ☰
        </button>
        <ul className={`nav-links ${open ? 'open' : ''}`}>
          <li><NavLink to="/" end onClick={() => setOpen(false)}>🏠 Home</NavLink></li>
          <li><NavLink to="/browse" onClick={() => setOpen(false)}>📋 Browse</NavLink></li>
          <li><NavLink to="/report" onClick={() => setOpen(false)}>📝 Report</NavLink></li>
        </ul>
      </div>
    </nav>
  );
}
