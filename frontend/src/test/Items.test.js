const { render, screen } = require('@testing-library/react');
const React = require('react');
const { MemoryRouter } = require('react-router-dom');
const { DataProvider } = require('../state/DataContext');
const Items = require('../pages/Items').default;

test('loads and shows items', async () => {
  fetch.mockResponseOnce(JSON.stringify([
    { id: 1, name: 'Laptop Pro', category: 'Electronics', price: 2499 },
    { id: 2, name: 'Ergonomic Chair', category: 'Furniture', price: 799 }
  ]));

  render(
    <MemoryRouter>
      <DataProvider><Items /></DataProvider>
    </MemoryRouter>
  );

  expect(await screen.findByText(/Apple/i)).toBeInTheDocument();
});

// test('renders items from server', async () => {
//   renderWithProvider(<Items />);
//   expect(await screen.findByText(/Apple/i)).toBeInTheDocument();
//   expect(screen.getByText(/Banana/i)).toBeInTheDocument();
// });
//
// test('filters items with search', async () => {
//   renderWithProvider(<Items />);
//   await screen.findByText(/Apple/i);
//
//   fireEvent.change(screen.getByPlaceholderText(/search/i), { target: { value: 'apple' } });
//   await waitFor(() => {
//     expect(screen.getByText(/Apple/i)).toBeInTheDocument();
//     expect(screen.queryByText(/Banana/i)).not.toBeInTheDocument();
//   });
// });
//
// test('handles server error', async () => {
//   server.use(
//     rest.get('/api/items', (req, res, ctx) => res(ctx.status(500)))
//   );
//   renderWithProvider(<Items />);
//   await waitFor(() => {
//     expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
//   });
// });
