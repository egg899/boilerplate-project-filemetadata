var express = require('express');
var cors = require('cors');
require('dotenv').config()
const fs = require('fs');
const path = require('path');
const multer = require('multer');
var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

// Crear la carpeta si no existe
const uploadDir = path.join(__dirname, 'uploads')
console.log(uploadDir);
if(!fs.existsSync(uploadDir)) {
   fs.mkdirSync(uploadDir, { recursive: true });
}


// Carpeta donde se van aguardar los archivos
const storage = multer.diskStorage({
  destination : function(req, res, cb) {
    cb(null, 'uploads/');//Crear carpeta
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); //mantiene el nombre original
  }
})


const upload = multer({ storage: storage });

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});


app.post('/api/fileanalyse', upload.single('upfile'), (req, res) => {
  if(!req.file) return res.status(400).json({ error: 'No file uploaded' });
  console.log(req.file);
  // res.send('Done');
  res.json({
    name: req.file.originalname,
    type:req.file.mimetype,
    size: req.file.size
  });
});


const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port http://localhost:' + port)
});
