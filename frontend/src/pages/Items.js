import React, { useEffect, useState, useCallback } from 'react';
import { useData } from '../state/DataContext';
import { Link } from 'react-router-dom';
import { FixedSizeList as List } from 'react-window';
import '../assets/css/items.css';

function Items() {
  const { fetchItems } = useData();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(50);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);

  const totalPages = Math.ceil(total / limit);

  const loadData = useCallback(() => {
    const controller = new AbortController();
    setLoading(true);

    fetchItems({ page, limit, q }, controller.signal)
      .then(data => {
        setItems(data.items);
        setTotal(data.total);
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error(err);
        }
      })
      .finally(() => setLoading(false));

    return controller;
  }, [fetchItems, page, limit, q]);

  useEffect(() => {
    const controller = loadData();
    return () => controller.abort();
  }, [loadData]);

  const Row = ({ index, style }) => {
    const item = items[index];
    if (!item) return null;

    return (
      <div style={style} className="item-row">
        <Link to={`/items/${item.id}`} className="item-link">
          {item.name}
        </Link>
      </div>
    );
  };

  const SkeletonRow = ({ index, style }) => (
    <div style={style} className="skeleton-row" aria-hidden="true">
      <div className="skeleton-bar" />
    </div>
  );

  return (
    <div className="items-container">
      <h2 id="items-heading">Items</h2>

      <label htmlFor="search-box" className="visually-hidden">
        Search items
      </label>
      <input
        id="search-box"
        type="text"
        placeholder="Search..."
        value={q}
        onChange={e => {
          setPage(1);
          setQ(e.target.value);
        }}
        className="search-input"
      />

      {loading ? (
        <List
          height={400}
          itemCount={limit}
          itemSize={35}
          width="100%"
          className="items-list"
        >
          {SkeletonRow}
        </List>
      ) : (
        <>
          {items.length > 0 ? (
            <List
              height={400}
              itemCount={items.length}
              itemSize={35}
              width="100%"
              className="items-list"
            >
              {Row}
            </List>
          ) : (
            <p>No items found</p>
          )}

          <div className="pagination-controls">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn"
            >
              Prev
            </button>
            <span className="page-info">
              Page {page} of {totalPages || 1}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="btn"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Items;
