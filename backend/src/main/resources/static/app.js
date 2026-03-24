/* ==========================================
   Campus Lost & Found — JavaScript Application
   ========================================== */

const API_BASE = '/api';

// ===== API Helper Functions =====
const api = {
    async get(endpoint) {
        const res = await fetch(`${API_BASE}${endpoint}`);
        if (!res.ok) throw new Error(`GET ${endpoint} failed: ${res.status}`);
        return res.json();
    },

    async post(endpoint, data) {
        const res = await fetch(`${API_BASE}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || `POST ${endpoint} failed: ${res.status}`);
        }
        return res.json();
    },

    async put(endpoint, data = {}) {
        const res = await fetch(`${API_BASE}${endpoint}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error(`PUT ${endpoint} failed: ${res.status}`);
        return res.json();
    },

    async delete(endpoint) {
        const res = await fetch(`${API_BASE}${endpoint}`, { method: 'DELETE' });
        if (!res.ok) throw new Error(`DELETE ${endpoint} failed: ${res.status}`);
        return res.json();
    },
};

// ===== Toast Notifications =====
function showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// ===== DOM Helpers =====
function $(selector) {
    return document.querySelector(selector);
}

function $$(selector) {
    return document.querySelectorAll(selector);
}

function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function getStatusClass(status) {
    return (status || '').toLowerCase();
}

function getCategoryIcon(category) {
    const icons = {
        'Electronics': '📱',
        'Bags': '🎒',
        'Documents': '📄',
        'Keys': '🔑',
        'Clothing': '👕',
        'Personal Items': '🧴',
        'Books': '📚',
        'Accessories': '⌚',
        'Other': '📦',
    };
    return icons[category] || '📦';
}

// ===== URL Query Params =====
function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}

// ===== Render Item Card =====
function renderItemCard(item) {
    return `
        <div class="item-card fade-in-up" onclick="window.location.href='item.html?id=${item.id}'">
            <div class="item-card-header">
                <h3>${getCategoryIcon(item.category)} ${escapeHtml(item.title)}</h3>
                <span class="status-badge ${getStatusClass(item.status)}">${item.status}</span>
            </div>
            <div class="item-card-body">
                <p>${escapeHtml(item.description || 'No description provided.')}</p>
            </div>
            <div class="item-card-meta">
                <span>📍 ${escapeHtml(item.location || 'Unknown')}</span>
                <span>📅 ${formatDate(item.dateReported)}</span>
                <span>👤 ${escapeHtml(item.reporterName)}</span>
            </div>
        </div>
    `;
}

// ===== Escape HTML =====
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== Mobile Nav Toggle =====
document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('.nav-toggle');
    const links = document.querySelector('.nav-links');
    if (toggle && links) {
        toggle.addEventListener('click', () => {
            links.classList.toggle('open');
        });
    }
});

// ===== Stats Loader =====
async function loadStats() {
    try {
        const stats = await api.get('/stats');
        const lostEl = document.getElementById('stat-lost');
        const foundEl = document.getElementById('stat-found');
        const claimedEl = document.getElementById('stat-claimed');
        const returnedEl = document.getElementById('stat-returned');
        if (lostEl) lostEl.textContent = stats.totalLost || 0;
        if (foundEl) foundEl.textContent = stats.totalFound || 0;
        if (claimedEl) claimedEl.textContent = stats.totalClaimed || 0;
        if (returnedEl) returnedEl.textContent = stats.totalReturned || 0;
    } catch (e) {
        console.error('Failed to load stats:', e);
    }
}

// ===== Recent Items Loader =====
async function loadRecentItems() {
    const grid = document.getElementById('recent-items-grid');
    if (!grid) return;
    grid.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
    try {
        const items = await api.get('/items/recent');
        if (items.length === 0) {
            grid.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <div class="empty-icon">🔍</div>
                    <h3>No items reported yet</h3>
                    <p>Be the first to report a lost or found item!</p>
                </div>`;
            return;
        }
        grid.innerHTML = items.map(renderItemCard).join('');
    } catch (e) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <div class="empty-icon">⚠️</div>
                <h3>Could not load items</h3>
                <p>Make sure the backend server is running on port 8080.</p>
            </div>`;
    }
}

// ===== Browse Items with Filters =====
async function loadBrowseItems() {
    const grid = document.getElementById('browse-items-grid');
    if (!grid) return;
    grid.innerHTML = '<div class="loading"><div class="spinner"></div></div>';

    const status = document.getElementById('filter-status')?.value || '';
    const category = document.getElementById('filter-category')?.value || '';
    const keyword = document.getElementById('filter-keyword')?.value || '';

    let query = '/items?';
    if (status) query += `status=${encodeURIComponent(status)}&`;
    if (category) query += `category=${encodeURIComponent(category)}&`;
    if (keyword) query += `keyword=${encodeURIComponent(keyword)}&`;

    try {
        const items = await api.get(query);
        if (items.length === 0) {
            grid.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <div class="empty-icon">🔍</div>
                    <h3>No items match your filters</h3>
                    <p>Try adjusting your search criteria.</p>
                </div>`;
            return;
        }
        grid.innerHTML = items.map(renderItemCard).join('');
    } catch (e) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <div class="empty-icon">⚠️</div>
                <h3>Could not load items</h3>
                <p>Make sure the backend server is running on port 8080.</p>
            </div>`;
    }
}

// ===== Item Detail Loader =====
async function loadItemDetail() {
    const container = document.getElementById('item-detail-container');
    if (!container) return;

    const id = getQueryParam('id');
    if (!id) {
        container.innerHTML = '<div class="empty-state"><h3>No item ID provided</h3></div>';
        return;
    }

    container.innerHTML = '<div class="loading"><div class="spinner"></div></div>';

    try {
        const item = await api.get(`/items/${id}`);
        const claims = await api.get(`/claims/item/${id}`);

        container.innerHTML = `
            <div class="item-detail-card fade-in-up">
                <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1rem; margin-bottom:1rem;">
                    <h1>${getCategoryIcon(item.category)} ${escapeHtml(item.title)}</h1>
                    <span class="status-badge ${getStatusClass(item.status)}" style="font-size:0.85rem; padding:6px 14px;">${item.status}</span>
                </div>

                <p class="item-description">${escapeHtml(item.description || 'No description provided.')}</p>

                <div class="meta-grid">
                    <div class="meta-item">
                        <span class="meta-label">📂 Category</span>
                        <span class="meta-value">${escapeHtml(item.category)}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">📍 Location</span>
                        <span class="meta-value">${escapeHtml(item.location || 'N/A')}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">📅 Date Reported</span>
                        <span class="meta-value">${formatDate(item.dateReported)}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">👤 Reported By</span>
                        <span class="meta-value">${escapeHtml(item.reporterName)}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">📧 Email</span>
                        <span class="meta-value">${escapeHtml(item.reporterEmail)}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">📞 Phone</span>
                        <span class="meta-value">${escapeHtml(item.contactPhone || 'N/A')}</span>
                    </div>
                </div>

                ${item.status !== 'RETURNED' && item.status !== 'CLAIMED' ? `
                <div style="display:flex; gap:0.75rem; margin-top:1.5rem;">
                    <button class="btn btn-danger btn-sm" onclick="deleteItem(${item.id})">🗑 Delete Item</button>
                    <button class="btn btn-success btn-sm" onclick="markReturned(${item.id})">✅ Mark as Returned</button>
                </div>` : ''}
            </div>

            <!-- Claim Form -->
            ${item.status === 'LOST' || item.status === 'FOUND' ? `
            <div class="form-card fade-in-up" style="margin-bottom:2rem;">
                <h2 style="font-size:1.25rem;">🙋 Submit a Claim</h2>
                <p class="form-subtitle">Think this belongs to you? Submit a claim with details.</p>
                <form id="claim-form" onsubmit="submitClaim(event, ${item.id})">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="claimer-name">Your Name *</label>
                            <input type="text" id="claimer-name" required placeholder="Enter your full name">
                        </div>
                        <div class="form-group">
                            <label for="claimer-email">Your Email *</label>
                            <input type="email" id="claimer-email" required placeholder="Your campus email">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="claim-message">Description / Proof *</label>
                        <textarea id="claim-message" required placeholder="Describe why this item is yours. Include any distinguishing features, purchase details, etc."></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Submit Claim</button>
                </form>
            </div>` : ''}

            <!-- Claims List -->
            <div class="claims-section fade-in-up">
                <h3>📋 Claims (${claims.length})</h3>
                ${claims.length === 0 ? '<p style="color:var(--text-muted); margin-top:0.5rem;">No claims submitted yet.</p>' :
                claims.map(claim => `
                    <div class="claim-card">
                        <div class="claim-info">
                            <h4>${escapeHtml(claim.claimerName)} — <span style="color:var(--text-muted)">${escapeHtml(claim.claimerEmail)}</span></h4>
                            <p>${escapeHtml(claim.message)}</p>
                            <p style="margin-top:4px; font-size:0.75rem; color:var(--text-muted);">Claimed on: ${formatDate(claim.claimDate)} • Status: <strong>${claim.status}</strong></p>
                        </div>
                        ${claim.status === 'PENDING' ? `
                        <div class="claim-actions">
                            <button class="btn btn-success btn-sm" onclick="approveClaim(${claim.id})">✅ Approve</button>
                            <button class="btn btn-danger btn-sm" onclick="rejectClaim(${claim.id})">❌ Reject</button>
                        </div>` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    } catch (e) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">⚠️</div>
                <h3>Item not found</h3>
                <p>This item may have been removed or the server is offline.</p>
            </div>`;
    }
}

// ===== Report Form Submit =====
async function submitReport(event) {
    event.preventDefault();

    const item = {
        title: document.getElementById('item-title').value.trim(),
        description: document.getElementById('item-description').value.trim(),
        category: document.getElementById('item-category').value,
        location: document.getElementById('item-location').value.trim(),
        status: document.querySelector('.status-toggle button.active-lost') ? 'LOST' :
                document.querySelector('.status-toggle button.active-found') ? 'FOUND' : 'LOST',
        reporterName: document.getElementById('reporter-name').value.trim(),
        reporterEmail: document.getElementById('reporter-email').value.trim(),
        contactPhone: document.getElementById('reporter-phone').value.trim(),
        imageUrl: document.getElementById('item-image-url')?.value.trim() || null,
    };

    try {
        await api.post('/items', item);
        showToast('Item reported successfully!', 'success');
        setTimeout(() => window.location.href = 'browse.html', 1000);
    } catch (e) {
        showToast('Failed to report item. Please check all fields.', 'error');
    }
}

// ===== Claim Submit =====
async function submitClaim(event, itemId) {
    event.preventDefault();

    const claim = {
        itemId: itemId,
        claimerName: document.getElementById('claimer-name').value.trim(),
        claimerEmail: document.getElementById('claimer-email').value.trim(),
        message: document.getElementById('claim-message').value.trim(),
    };

    try {
        await api.post('/claims', claim);
        showToast('Claim submitted successfully!', 'success');
        setTimeout(() => loadItemDetail(), 1000);
    } catch (e) {
        showToast('Failed to submit claim. Please try again.', 'error');
    }
}

// ===== Approve / Reject Claim =====
async function approveClaim(claimId) {
    try {
        await api.put(`/claims/${claimId}/approve`);
        showToast('Claim approved! Item marked as claimed.', 'success');
        setTimeout(() => loadItemDetail(), 500);
    } catch (e) {
        showToast('Failed to approve claim.', 'error');
    }
}

async function rejectClaim(claimId) {
    try {
        await api.put(`/claims/${claimId}/reject`);
        showToast('Claim rejected.', 'info');
        setTimeout(() => loadItemDetail(), 500);
    } catch (e) {
        showToast('Failed to reject claim.', 'error');
    }
}

// ===== Delete Item =====
async function deleteItem(itemId) {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
        await api.delete(`/items/${itemId}`);
        showToast('Item deleted.', 'info');
        setTimeout(() => window.location.href = 'browse.html', 500);
    } catch (e) {
        showToast('Failed to delete item.', 'error');
    }
}

// ===== Mark Returned =====
async function markReturned(itemId) {
    try {
        await api.put(`/items/${itemId}`, { status: 'RETURNED' });
        showToast('Item marked as returned! 🎉', 'success');
        setTimeout(() => loadItemDetail(), 500);
    } catch (e) {
        showToast('Failed to update item.', 'error');
    }
}

// ===== Hero Search Redirect =====
function heroSearch(event) {
    event.preventDefault();
    const keyword = document.getElementById('hero-search-input')?.value.trim();
    if (keyword) {
        window.location.href = `browse.html?keyword=${encodeURIComponent(keyword)}`;
    }
}
