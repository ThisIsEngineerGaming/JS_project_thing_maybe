const express = require("express");
const fs      = require("fs");
const path    = require("path");
const cors    = require("cors");

const app = express();
const PORT = 3001;
const PRODUCTS_PATH = path.join(__dirname, "json", "products.json");

app.use(cors());
app.use(express.json());

// GET /api/products — reads products.json from disk and returns its contents as JSON
app.get("/api/products", (req, res) => {
  try {
    const data = fs.readFileSync(PRODUCTS_PATH, "utf-8");
    res.json(JSON.parse(data));
  } catch (err) {
    console.error("Failed to read products.json:", err);
    res.status(500).json({ error: "Could not read products.json" });
  }
});

// POST /api/products — receives the full product array in the request body and overwrites products.json
// Returns { success, count } on success, or an error object on failure
app.post("/api/products", (req, res) => {
  try {
    const products = req.body;

    if (!Array.isArray(products)) {
      return res.status(400).json({ error: "Body must be a JSON array." });
    }

    fs.writeFileSync(PRODUCTS_PATH, JSON.stringify(products, null, 2), "utf-8");
    console.log(`products.json updated — ${products.length} products saved.`);
    res.json({ success: true, count: products.length });
  } catch (err) {
    console.error("Failed to write products.json:", err);
    res.status(500).json({ error: "Could not write products.json" });
  }
});

app.listen(PORT, () => {
  console.log(`Admin API server running at http://localhost:${PORT}`);
});
