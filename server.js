const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

// Yükleme yapılacak klasör
const uploadDirectory = path.join(__dirname, 'uploads');

// Klasör yoksa oluştur
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}

// Multer yapılandırması: Dosyaları 'uploads' klasörüne kaydedeceğiz
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Dosya ismi olarak zaman damgası kullanılabilir
  },
});

const upload = multer({ storage });

// Dosya yükleme endpoint'i
app.post('/upload', upload.array('files'), (req, res) => {
  res.json({ message: 'Dosyalar başarıyla yüklendi', files: req.files });
});

// Dosya yapısını çekmek için bir endpoint
app.get('/api/files', (req, res) => {
  const getFiles = (dirPath) => {
    const items = fs.readdirSync(dirPath);
    return items.map(item => {
      const fullPath = path.join(dirPath, item);
      const stats = fs.statSync(fullPath);
      
      return {
        text: item,
        type: stats.isDirectory() ? 'folder' : 'file',
        children: stats.isDirectory() ? getFiles(fullPath) : [],
      };
    });
  };

  const fileStructure = getFiles(uploadDirectory);
  res.json(fileStructure);
});

// Sunucuyu başlat
app.listen(3000, () => {
  console.log('Sunucu çalışıyor: http://localhost:3000');
});
