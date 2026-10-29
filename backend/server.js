import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api/items', (req, res) => {
  res.json({
    items: [
      { id: 1, name: 'Alpha', status: 'active' },
      { id: 2, name: 'Beta', status: 'pending' },
      { id: 3, name: 'Gamma', status: 'active' }
    ]
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server listening on http://0.0.0.0:${PORT}`);
});
