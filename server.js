const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("uploads"));

// Pastikan folder uploads ada
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("📁 Folder 'uploads' dibuat otomatis.");
}

// Konfigurasi multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});
const upload = multer({ storage });

// Upload satu file
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Tidak ada file" });
  res.status(200).json({
    message: "Upload berhasil",
    file: `/uploads/${req.file.filename}`,
  });
});

// Upload banyak file
app.post("/upload-multiple", upload.array("files", 20), (req, res) => {
  if (!req.files || req.files.length === 0)
    return res.status(400).json({ message: "Tidak ada file diunggah" });

  const uploaded = req.files.map((f) => ({
    name: f.filename,
    original: f.originalname,
    size: f.size,
    path: `/uploads/${f.filename}`,
  }));

  res.json({ message: "Berhasil upload beberapa file", uploaded });
});

// Daftar file (dengan size)
app.get("/files", async (req, res) => {
  try {
    const names = await fs.promises.readdir(uploadDir);
    const stats = await Promise.all(
      names.map(async (n) => {
        const st = await fs.promises.stat(path.join(uploadDir, n));
        return { name: n, size: st.size };
      })
    );
    res.json(stats);
  } catch (e) {
    res.status(500).json({ error: "Gagal membaca folder" });
  }
});

// Hapus file
app.delete("/files/:name", async (req, res) => {
  try {
    const name = req.params.name;
    await fs.promises.unlink(path.join(uploadDir, name));
    res.json({ message: "File dihapus", name });
  } catch (e) {
    res.status(404).json({ error: "File tidak ditemukan" });
  }
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`🚀 ElectraPrint Backend berjalan di port ${PORT}`);
});
// Health check endpoint untuk Render
app.get("/healthz", (req, res) => {
  res.status(200).send("OK");
});
