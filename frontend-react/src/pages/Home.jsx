import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import ItemCard from '../components/ItemCard';
import './Home.css';

export default function Home() {
  const [stats, setStats] = useState({ totalLost: 0, totalFound: 0, totalClaimed: 0, totalReturned: 0 });
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const fetchWithSignal = (endpoint) =>
      fetch(`/api${endpoint}`, {
        signal: controller.signal,
      }).then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      });

    Promise.all([
      fetchWithSignal('/stats').catch(() => ({ totalLost: 0, totalFound: 0, totalClaimed: 0, totalReturned: 0 })),
      fetchWithSignal('/items/recent').catch(() => []),
    ])
      .then(([s, items]) => {
        setStats(s);
        setRecentItems(Array.isArray(items) ? items : []);
      })
      .catch(() => {
        // Fallback: ensure state is valid even if something unexpected happens
        setStats({ totalLost: 0, totalFound: 0, totalClaimed: 0, totalReturned: 0 });
        setRecentItems([]);
      })
      .finally(() => {
        clearTimeout(timeout);
        setLoading(false);
      });

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/browse?keyword=${encodeURIComponent(keyword.trim())}`);
    }
  };

  return (
    <div className="container page-content">
      {/* Hero */}
      <section className="hero">
        <h1>Lost Something?<br />We'll Help You Find It.</h1>
        <p>A centralized platform for campus students to report, search, and recover lost & found items efficiently.</p>
        <form className="search-bar" onSubmit={handleSearch}>
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search for lost or found items..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            autoComplete="off"
          />
        </form>
      </section>

      {/* Stats */}
      <section className="stats-grid">
        <div className="stat-card lost">
          <div className="stat-number">{stats.totalLost || 0}</div>
          <div className="stat-label">Items Lost</div>
        </div>
        <div className="stat-card found">
          <div className="stat-number">{stats.totalFound || 0}</div>
          <div className="stat-label">Items Found</div>
        </div>
        <div className="stat-card claimed">
          <div className="stat-number">{stats.totalClaimed || 0}</div>
          <div className="stat-label">Items Claimed</div>
        </div>
        <div className="stat-card returned">
          <div className="stat-number">{stats.totalReturned || 0}</div>
          <div className="stat-label">Items Returned</div>
        </div>
      </section>

      {/* Recent Items */}
      <section>
        <div className="section-header">
          <h2>🕐 Recent Reports</h2>
          <Link to="/browse">View all →</Link>
        </div>
        <div className="items-grid">
          {loading ? (
            <div className="loading"><div className="spinner"></div></div>
          ) : recentItems.length === 0 ? (
            <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
              <div className="empty-icon">🔍</div>
              <h3>No items reported yet</h3>
              <p>Be the first to report a lost or found item!</p>
            </div>
          ) : (
            recentItems.map((item) => <ItemCard key={item.id} item={item} />)
          )}
        </div>
      </section>
    </div>
  );
}
