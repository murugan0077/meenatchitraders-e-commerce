import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());

// Ensure directory exists
const uploadDir = path.join(__dirname, 'public/products');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/products')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage })

app.post('/upload', upload.single('image'), function (req, res) {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    console.log(`File uploaded: ${req.file.originalname}`);
    res.json({ path: `/products/${req.file.originalname}` });
})

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Local upload server running on port ${PORT}`);
});
