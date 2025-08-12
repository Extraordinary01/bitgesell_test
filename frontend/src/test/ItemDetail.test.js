// import React from 'react';
// import { render, screen, waitFor } from '@testing-library/react';
// import { MemoryRouter, Route, Routes } from 'react-router-dom';
// import ItemDetail from '../pages/ItemDetail';
// import { server } from './server';
// import { rest } from 'msw';
//
// function renderWithRoute(initialPath) {
//   return render(
//     <MemoryRouter initialEntries={[initialPath]}>
//       <Routes>
//         <Route path="/items/:id" element={<ItemDetail />} />
//         <Route path="/" element={<div>Home</div>} />
//       </Routes>
//     </MemoryRouter>
//   );
// }
//
// test('renders loading state', () => {
//   renderWithRoute('/items/1');
//   expect(screen.getByText(/loading/i)).toBeInTheDocument();
// });
//
// test('renders item detail from server', async () => {
//   renderWithRoute('/items/1');
//   expect(await screen.findByText(/Apple/i)).toBeInTheDocument();
//   expect(screen.getByText(/Category/i)).toBeInTheDocument();
// });
//
// test('navigates home on error', async () => {
//   server.use(
//     rest.get('/api/items/:id', (req, res, ctx) => res(ctx.status(404)))
//   );
//   renderWithRoute('/items/999');
//   await waitFor(() => {
//     expect(screen.getByText(/Home/i)).toBeInTheDocument();
//   });
// });
