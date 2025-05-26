import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(bodyParser.json());


app.get('/message', (req, res) => {
  res.json({ message: 'Hello from backend!' });
});

app.post('/data', (req, res) => {
  const { data } = req.body;
  res.json({ received: data, status: 'success' });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
