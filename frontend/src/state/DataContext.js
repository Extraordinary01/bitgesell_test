import React, { createContext, useCallback, useContext, useState } from 'react';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [items, setItems] = useState([]);

  const fetchItems = useCallback(async ({ page = 1, limit = 10, q = '' } = {}, signal) => {
    const params = new URLSearchParams({ page, limit, q });
    const res = await fetch(`/api/items?${params.toString()}`, { signal });
    if (!res.ok) throw new Error('Failed to fetch items');
    return res.json();
  }, []);

  return (
    <DataContext.Provider value={{ items, fetchItems }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);