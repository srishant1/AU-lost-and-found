import { useState, useCallback } from 'react';
import './Toast.css';

let addToastGlobal = null;

export function showToast(message, type = 'info') {
  if (addToastGlobal) addToastGlobal(message, type);
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  addToastGlobal = useCallback((message, type) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type}`}>
          {t.message}
        </div>
      ))}
    </div>
  );
}
