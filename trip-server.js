const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json"); // 金鑰檔案

// 初始化 Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

const app = express();
app.use(cors());
app.use(express.json());

// ===== 行程 Schedule =====

// 取得所有行程
app.get("/api/schedule", async (req, res) => {
  const snapshot = await db.collection("schedule").get();
  const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  res.json(data);
});

// 新增行程
app.post("/api/schedule", async (req, res) => {
  const { text, category, day } = req.body;
  const docRef = await db.collection("schedule").add({ text, category, day });
  const doc = await docRef.get();
  res.json({ id: doc.id, ...doc.data() });
});

// 刪除行程
app.delete("/api/schedule/:id", async (req, res) => {
  await db.collection("schedule").doc(req.params.id).delete();
  res.json({ success: true });
});

// ===== 待辦 Todo =====
app.get("/api/todo", async (req, res) => {
  const snapshot = await db.collection("todo").get();
  const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  res.json(data);
});

app.post("/api/todo", async (req, res) => {
  const { text, day } = req.body;
  const docRef = await db.collection("todo").add({ text, day });
  const doc = await docRef.get();
  res.json({ id: doc.id, ...doc.data() });
});

app.delete("/api/todo/:id", async (req, res) => {
  await db.collection("todo").doc(req.params.id).delete();
  res.json({ success: true });
});

// ===== 行李 Luggage =====
app.get("/api/luggage", async (req, res) => {
  const snapshot = await db.collection("luggage").get();
  const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  res.json(data);
});

app.post("/api/luggage", async (req, res) => {
  const { text } = req.body;
  const docRef = await db.collection("luggage").add({ text });
  const doc = await docRef.get();
  res.json({ id: doc.id, ...doc.data() });
});

app.delete("/api/luggage/:id", async (req, res) => {
  await db.collection("luggage").doc(req.params.id).delete();
  res.json({ success: true });
});

// ===== 購物 Shopping =====
app.get("/api/shopping", async (req, res) => {
  const snapshot = await db.collection("shopping").get();
  const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  res.json(data);
});

app.post("/api/shopping", async (req, res) => {
  const { text } = req.body;
  const docRef = await db.collection("shopping").add({ text });
  const doc = await docRef.get();
  res.json({ id: doc.id, ...doc.data() });
});

app.delete("/api/shopping/:id", async (req, res) => {
  await db.collection("shopping").doc(req.params.id).delete();
  res.json({ success: true });
});

// ===== 啟動 Server =====
app.listen(3000, () => console.log("Server running on http://localhost:3000"));
