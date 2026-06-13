// One-time script to upload products.json to Firestore
// Run with: node scripts/seedFirestore.mjs

import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const firebaseConfig = {
  apiKey: "AIzaSyACneVXG2VPw6L34pAJ75Wd-8KuHr_E4LQ",
  authDomain: "testproj-9254d.firebaseapp.com",
  projectId: "testproj-9254d",
  storageBucket: "testproj-9254d.firebasestorage.app",
  messagingSenderId: "1065688599308",
  appId: "1:1065688599308:web:5eaf8b60bdfc27b7e5d729",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const products = JSON.parse(
  readFileSync(join(__dirname, "../json/products.json"), "utf-8")
);

console.log(`Uploading ${products.length} products to Firestore...`);

for (const product of products) {
  await setDoc(doc(db, "products", String(product.id)), product);
  console.log(`  ✓ Uploaded: ${product.name}`);
}

console.log("Done! All products uploaded to Firestore.");
process.exit(0);
