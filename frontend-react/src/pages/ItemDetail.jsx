import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { showToast } from '../components/Toast';
import { formatDate, getCategoryIcon } from '../utils/helpers';
import './ItemDetail.css';

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claimForm, setClaimForm] = useState({ claimerName: '', claimerEmail: '', message: '' });

  const loadItem = async () => {
    try {
      const [itemData, claimsData] = await Promise.all([
        api.get(`/items/${id}`),
        api.get(`/claims/item/${id}`),
      ]);
      setItem(itemData);
      setClaims(claimsData);
    } catch {
      setItem(null);
    }
    setLoading(false);
  };

  useEffect(() => { loadItem(); }, [id]);

  const submitClaim = async (e) => {
    e.preventDefault();
    try {
      await api.post('/claims', { itemId: Number(id), ...claimForm });
      showToast('Claim submitted successfully!', 'success');
      setClaimForm({ claimerName: '', claimerEmail: '', message: '' });
      loadItem();
    } catch {
      showToast('Failed to submit claim.', 'error');
    }
  };

  const approveClaim = async (claimId) => {
    try {
      await api.put(`/claims/${claimId}/approve`);
      showToast('Claim approved!', 'success');
      loadItem();
    } catch {
      showToast('Failed to approve claim.', 'error');
    }
  };

  const rejectClaim = async (claimId) => {
    try {
      await api.put(`/claims/${claimId}/reject`);
      showToast('Claim rejected.', 'info');
      loadItem();
    } catch {
      showToast('Failed to reject claim.', 'error');
    }
  };

  const deleteItem = async () => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await api.delete(`/items/${id}`);
      showToast('Item deleted.', 'info');
      setTimeout(() => navigate('/browse'), 500);
    } catch {
      showToast('Failed to delete item.', 'error');
    }
  };

  const markReturned = async () => {
    try {
      await api.put(`/items/${id}`, { status: 'RETURNED' });
      showToast('Item marked as returned! 🎉', 'success');
      loadItem();
    } catch {
      showToast('Failed to update item.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="container page-content">
        <div className="loading"><div className="spinner"></div></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="container page-content">
        <div className="empty-state">
          <div className="empty-icon">⚠️</div>
          <h3>Item not found</h3>
          <p>This item may have been removed or the server is offline.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container page-content">
      <div className="item-detail">
        <div style={{ marginBottom: '1.5rem' }}>
          <Link to="/browse" className="back-link">← Back to Browse</Link>
        </div>

        {/* Item Detail Card */}
        <div className="item-detail-card fade-in-up">
          <div className="detail-header">
            <h1>{getCategoryIcon(item.category)} {item.title}</h1>
            <span className={`status-badge ${(item.status || '').toLowerCase()}`} style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
              {item.status}
            </span>
          </div>

          <p className="item-description">{item.description || 'No description provided.'}</p>

          <div className="meta-grid">
            <div className="meta-item">
              <span className="meta-label">📂 Category</span>
              <span className="meta-value">{item.category}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">📍 Location</span>
              <span className="meta-value">{item.location || 'N/A'}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">📅 Date Reported</span>
              <span className="meta-value">{formatDate(item.dateReported)}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">👤 Reported By</span>
              <span className="meta-value">{item.reporterName}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">📧 Email</span>
              <span className="meta-value">{item.reporterEmail}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">📞 Phone</span>
              <span className="meta-value">{item.contactPhone || 'N/A'}</span>
            </div>
          </div>

          {item.status !== 'RETURNED' && item.status !== 'CLAIMED' && (
            <div className="detail-actions">
              <button className="btn btn-danger btn-sm" onClick={deleteItem}>🗑 Delete Item</button>
              <button className="btn btn-success btn-sm" onClick={markReturned}>✅ Mark as Returned</button>
            </div>
          )}
        </div>

        {/* Claim Form */}
        {(item.status === 'LOST' || item.status === 'FOUND') && (
          <div className="form-card fade-in-up" style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem' }}>🙋 Submit a Claim</h2>
            <p className="form-subtitle">Think this belongs to you? Submit a claim with details.</p>
            <form onSubmit={submitClaim}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="claimer-name">Your Name *</label>
                  <input type="text" id="claimer-name" required placeholder="Enter your full name"
                    value={claimForm.claimerName} onChange={(e) => setClaimForm({ ...claimForm, claimerName: e.target.value })} />
                </div>
                <div className="form-group">
                  <label htmlFor="claimer-email">Your Email *</label>
                  <input type="email" id="claimer-email" required placeholder="Your campus email"
                    value={claimForm.claimerEmail} onChange={(e) => setClaimForm({ ...claimForm, claimerEmail: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="claim-message">Description / Proof *</label>
                <textarea id="claim-message" required placeholder="Describe why this item is yours. Include any distinguishing features, purchase details, etc."
                  value={claimForm.message} onChange={(e) => setClaimForm({ ...claimForm, message: e.target.value })} />
              </div>
              <button type="submit" className="btn btn-primary">Submit Claim</button>
            </form>
          </div>
        )}

        {/* Claims List */}
        <div className="claims-section fade-in-up">
          <h3>📋 Claims ({claims.length})</h3>
          {claims.length === 0 ? (
            <p className="no-claims">No claims submitted yet.</p>
          ) : (
            claims.map((claim) => (
              <div key={claim.id} className="claim-card">
                <div className="claim-info">
                  <h4>{claim.claimerName} — <span style={{ color: 'var(--text-muted)' }}>{claim.claimerEmail}</span></h4>
                  <p>{claim.message}</p>
                  <p className="claim-meta">Claimed on: {formatDate(claim.claimDate)} • Status: <strong>{claim.status}</strong></p>
                </div>
                {claim.status === 'PENDING' && (
                  <div className="claim-actions">
                    <button className="btn btn-success btn-sm" onClick={() => approveClaim(claim.id)}>✅ Approve</button>
                    <button className="btn btn-danger btn-sm" onClick={() => rejectClaim(claim.id)}>❌ Reject</button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
