const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ===== 連 Firebase =====
const serviceAccount = require(path.join(__dirname, 'serviceAccountKey.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://travel-plan-544b5.firebaseapp.com" // 改成你的 Firebase Database URL
});

const db = admin.firestore();

// ===== schedule API =====
app.get('/api/schedule', async (req, res) => {
  try {
    const snapshot = await db.collection('schedule').get();
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

app.post('/api/schedule', async (req, res) => {
  try {
    const { text, category, day } = req.body;
    const ref = await db.collection('schedule').add({ text, category, day });
    const doc = await ref.get();
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

app.delete('/api/schedule/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('schedule').doc(id).delete();
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

// ===== todo API =====
app.get('/api/todo', async (req, res) => {
  const snapshot = await db.collection('todo').get();
  res.json(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
});
app.post('/api/todo', async (req, res) => {
  const { text, day } = req.body;
  const ref = await db.collection('todo').add({ text, day });
  const doc = await ref.get();
  res.json({ id: doc.id, ...doc.data() });
});
app.delete('/api/todo/:id', async (req, res) => {
  await db.collection('todo').doc(req.params.id).delete();
  res.sendStatus(200);
});

// ===== luggage API =====
app.get('/api/luggage', async (req, res) => {
  const snapshot = await db.collection('luggage').get();
  res.json(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
});
app.post('/api/luggage', async (req, res) => {
  const { text } = req.body;
  const ref = await db.collection('luggage').add({ text });
  const doc = await ref.get();
  res.json({ id: doc.id, ...doc.data() });
});
app.delete('/api/luggage/:id', async (req, res) => {
  await db.collection('luggage').doc(req.params.id).delete();
  res.sendStatus(200);
});

// ===== shopping API =====
app.get('/api/shopping', async (req, res) => {
  const snapshot = await db.collection('shopping').get();
  res.json(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
});
app.post('/api/shopping', async (req, res) => {
  const { text } = req.body;
  const ref = await db.collection('shopping').add({ text });
  const doc = await ref.get();
  res.json({ id: doc.id, ...doc.data() });
});
app.delete('/api/shopping/:id', async (req, res) => {
  await db.collection('shopping').doc(req.params.id).delete();
  res.sendStatus(200);
});

// ===== 啟動 server =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
