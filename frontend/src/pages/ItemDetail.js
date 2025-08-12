import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let abortController = new AbortController();

    setLoading(true);
    fetch(`/api/items/${id}`, { signal: abortController.signal })
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(data => {
        setItem(data);
        setLoading(false);
      })
      .catch(err => {
        if (err.name !== 'AbortError') navigate('/');
      });

    return () => abortController.abort();
  }, [id, navigate]);

  if (loading) {
    return (
      <div style={{ padding: 16 }}>
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-text" style={{ width: '60%' }} />
        <div className="skeleton skeleton-text" style={{ width: '40%' }} />
      </div>
    );
  }

  if (!item) {
    return (
      <div style={{ padding: 16 }}>
        <p>Item not found.</p>
        <Link to="/" style={{ color: '#007bff' }}>Back to items</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: 16, maxWidth: 500, margin: '0 auto' }}>
      <Link to="/" style={{ display: 'inline-block', marginBottom: 12, color: '#007bff' }}>
        ← Back to items
      </Link>
      <div
        style={{
          padding: 20,
          border: '1px solid #ddd',
          borderRadius: 8,
          background: '#fff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}
      >
        <h2 style={{ marginBottom: 8 }}>{item.name}</h2>
        <p><strong>Category:</strong> {item.category}</p>
        <p><strong>Price:</strong> ${item.price}</p>
      </div>
    </div>
  );
}

export default ItemDetail;
