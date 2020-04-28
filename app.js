const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const cors = require('cors');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB file size limit
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'client/src/assets/img')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// api for file upload (sent as FormData with field 'sampleFile')
app.post('/upload', function(req, res) {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send(JSON.stringify({response: 'No file uploaded!'}));
    }
  
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.sampleFile;
  
    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv('client/src/assets/img/' + sampleFile.name, function(err) {
      if (err)
        return res.status(500).send(err);
  
      res.send(JSON.stringify({response: 'File uploaded!'}));
    });
});

// api for file download
app.get('/download', function(req, res) {
  const file = 'client/src/assets/img/' + req.query.filename;
  console.log(req.query.filename);
  res.download(file);
});

module.exports = app;
