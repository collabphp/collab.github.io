const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

// Multer ile dosya yükleme yapılandırması
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads'); // Dosyaların kaydedileceği dizin
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Dosya adını benzersiz yap
    }
});

const upload = multer({ storage: storage });

// Dosya yükleme route'u
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('Dosya yüklenmedi.');
    }
    res.status(200).json({ message: 'Dosya başarıyla yüklendi.' });
});

app.listen(port, () => {
    console.log(`Server ${port} numaralı portta çalışıyor.`);
});
