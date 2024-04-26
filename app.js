// Instead of import, use require
const express = require("express");
const cors = require("cors");
var multer = require('multer');
var path = require('path');


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Specify the directory for storing uploaded files
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); // Generate unique file name
    }
  });

  const fileFilter = function (req, file, cb) {
    if (file.mimetype === 'text/csv' || file.mimetype === 'application/vnd.ms-excel') {
      cb(null, true); 
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  };
  
  const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter 
  }).single('file'); 
  
  // Assuming you're using Express.js
  app.post('/api/upload', function(req, res) {
    upload(req, res, function(err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred
        return res.status(500).json({ error: err.message });
      }
      if (err) {
        // An error occurred during upload
        return res.status(500).json({ error: err.message });
      }
      if (!req.file) {
        // No file was uploaded
        return res.status(400).json({ error: 'No file uploaded' });
      }
      // File uploaded successfully
      return res.status(200).json({ message: 'File uploaded successfully' });
    });
  });




app.get('/', (req, res) => {
  res.status(200).send('Welcome, Node API Server is running...');
});





const PORT = process.env.PORT || 8000;

//server
app.listen(PORT, () => console.log(`Server is Running on ${PORT}`));