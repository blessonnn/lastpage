import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { JSONFilePreset } from 'lowdb/node';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Initialize lowdb
const defaultData = { signatures: [] };
const db = await JSONFilePreset('db.json', defaultData);

// Routes
app.get('/api/signatures', async (req, res) => {
  await db.read();
  res.json(db.data.signatures);
});

app.post('/api/signatures', async (req, res) => {
  const { name, message } = req.body;
  if (!name || !message) {
    return res.status(400).json({ error: 'Name and message are required' });
  }

  const newSignature = {
    id: Date.now().toString(),
    name,
    message,
    created_at: new Date().toISOString()
  };

  db.data.signatures.unshift(newSignature);
  await db.write();

  res.status(201).json(newSignature);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
