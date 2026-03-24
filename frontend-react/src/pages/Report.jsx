import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { showToast } from '../components/Toast';
import { CATEGORIES } from '../utils/helpers';
import './Report.css';

export default function Report() {
  const navigate = useNavigate();
  const [reportType, setReportType] = useState('LOST');
  const [form, setForm] = useState({
    title: '', description: '', category: '', location: '',
    reporterName: '', reporterEmail: '', contactPhone: '', imageUrl: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/items', {
        ...form,
        status: reportType,
        imageUrl: form.imageUrl || null,
      });
      showToast('Item reported successfully!', 'success');
      setTimeout(() => navigate('/browse'), 1000);
    } catch {
      showToast('Failed to report item. Please check all fields.', 'error');
    }
  };

  return (
    <div className="container page-content">
      <div className="form-container">
        <div className="form-card fade-in-up">
          <h2>📝 Report an Item</h2>
          <p className="form-subtitle">Did you lose or find something on campus? Fill in the details below.</p>

          <div className="status-toggle">
            <button
              type="button"
              className={reportType === 'LOST' ? 'active-lost' : ''}
              onClick={() => setReportType('LOST')}
            >
              ❌ I Lost Something
            </button>
            <button
              type="button"
              className={reportType === 'FOUND' ? 'active-found' : ''}
              onClick={() => setReportType('FOUND')}
            >
              ✅ I Found Something
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Item Title *</label>
              <input type="text" id="title" name="title" required placeholder="e.g., Blue Backpack, iPhone 14, Student ID Card" value={form.title} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea id="description" name="description" placeholder="Provide a detailed description — color, brand, distinguishing marks, what was inside, etc." value={form.description} onChange={handleChange} />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select id="category" name="category" required value={form.category} onChange={handleChange}>
                  <option value="">Select a category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.icon} {c.value}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="location">Location *</label>
                <input type="text" id="location" name="location" required placeholder="e.g., Library 2nd Floor, Cafeteria Block A" value={form.location} onChange={handleChange} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="reporterName">Your Name *</label>
                <input type="text" id="reporterName" name="reporterName" required placeholder="Full name" value={form.reporterName} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="reporterEmail">Your Email *</label>
                <input type="email" id="reporterEmail" name="reporterEmail" required placeholder="campus email" value={form.reporterEmail} onChange={handleChange} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contactPhone">Phone Number</label>
                <input type="tel" id="contactPhone" name="contactPhone" placeholder="Optional — for direct contact" value={form.contactPhone} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="imageUrl">Image URL</label>
                <input type="url" id="imageUrl" name="imageUrl" placeholder="Optional — paste an image link" value={form.imageUrl} onChange={handleChange} />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '0.5rem' }}>
              🚀 Submit Report
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
