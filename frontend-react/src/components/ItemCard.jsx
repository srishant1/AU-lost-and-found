import { useNavigate } from 'react-router-dom';
import { formatDate, getCategoryIcon } from '../utils/helpers';
import './ItemCard.css';

export default function ItemCard({ item }) {
  const navigate = useNavigate();

  return (
    <div className="item-card fade-in-up" onClick={() => navigate(`/item/${item.id}`)}>
      <div className="item-card-header">
        <h3>{getCategoryIcon(item.category)} {item.title}</h3>
        <span className={`status-badge ${(item.status || '').toLowerCase()}`}>{item.status}</span>
      </div>
      <div className="item-card-body">
        <p>{item.description || 'No description provided.'}</p>
      </div>
      <div className="item-card-meta">
        <span>📍 {item.location || 'Unknown'}</span>
        <span>📅 {formatDate(item.dateReported)}</span>
        <span>👤 {item.reporterName}</span>
      </div>
    </div>
  );
}
