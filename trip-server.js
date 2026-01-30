import express from "express";
import cors from "cors";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public")); // 前端放 public

// ----- Firebase 初始化 -----
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// ----- Helper -----
function getCollection(name) { return collection(db, name); }

// ----- API -----
app.get("/api/:collection", async (req,res)=>{
  const collName = req.params.collection;
  const snap = await getDocs(getCollection(collName));
  const items = snap.docs.map(d=>({ id:d.id, ...d.data() }));
  res.json(items);
});

app.post("/api/:collection", async (req,res)=>{
  const collName = req.params.collection;
  const ref = await addDoc(getCollection(collName), req.body);
  res.json({ id: ref.id, ...req.body });
});

app.delete("/api/:collection/:id", async (req,res)=>{
  const collName = req.params.collection;
  await deleteDoc(doc(getCollection(collName), req.params.id));
  res.json({ ok:true });
});

// ----- 啟動 -----
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}`));
