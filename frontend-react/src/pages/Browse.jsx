import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import ItemCard from '../components/ItemCard';
import { CATEGORIES } from '../utils/helpers';
import './Browse.css';

export default function Browse() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [keyword, setKeyword] = useState('');
  const [searchParams] = useSearchParams();
  const timerRef = useRef(null);

  useEffect(() => {
    const urlKeyword = searchParams.get('keyword') || '';
    if (urlKeyword) setKeyword(urlKeyword);
  }, [searchParams]);

  useEffect(() => {
    loadItems();
  }, [status, category, keyword]);

  const loadItems = async () => {
    setLoading(true);
    let query = '/items?';
    if (status) query += `status=${encodeURIComponent(status)}&`;
    if (category) query += `category=${encodeURIComponent(category)}&`;
    if (keyword) query += `keyword=${encodeURIComponent(keyword)}&`;
    try {
      const data = await api.get(query);
      setItems(data);
    } catch {
      setItems([]);
    }
    setLoading(false);
  };

  const handleKeywordChange = (e) => {
    clearTimeout(timerRef.current);
    const val = e.target.value;
    timerRef.current = setTimeout(() => setKeyword(val), 400);
  };

  return (
    <div className="container page-content">
      <div className="section-header" style={{ marginBottom: '0.5rem' }}>
        <h2>📋 Browse Items</h2>
        <Link to="/report">+ Report New Item</Link>
      </div>
      <p className="browse-subtitle">Search and filter through all reported lost & found items.</p>

      <div className="filter-bar">
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="LOST">❌ Lost</option>
          <option value="FOUND">✅ Found</option>
          <option value="CLAIMED">🙋 Claimed</option>
          <option value="RETURNED">🔄 Returned</option>
        </select>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.icon} {c.value}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="🔍 Search by keyword..."
          defaultValue={keyword}
          onChange={handleKeywordChange}
          style={{ flex: 1, minWidth: '200px' }}
        />
      </div>

      <div className="items-grid">
        {loading ? (
          <div className="loading"><div className="spinner"></div></div>
        ) : items.length === 0 ? (
          <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
            <div className="empty-icon">🔍</div>
            <h3>No items match your filters</h3>
            <p>Try adjusting your search criteria.</p>
          </div>
        ) : (
          items.map((item) => <ItemCard key={item.id} item={item} />)
        )}
      </div>
    </div>
  );
}
