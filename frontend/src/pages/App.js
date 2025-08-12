import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import Items from './Items';
import ItemDetail from './ItemDetail';
import { DataProvider } from '../state/DataContext';
import '../assets/css/styles.css';

function App() {
  return (
    <DataProvider>
      <header className="app-header">
        <h1 className="app-title">My Store</h1>
        <nav>
          <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Items
          </NavLink>
        </nav>
      </header>

      <main style={{ padding: 16 }}>
        <Routes>
          <Route path="/" element={<Items />} />
          <Route path="/items/:id" element={<ItemDetail />} />
        </Routes>
      </main>
    </DataProvider>
  );
}

export default App;
