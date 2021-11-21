const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');


//set storage engine

const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

//init upload 

const upload = multer({
    storage: storage,
    limits: { fileSize: 100000000000000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('myImage');


//check file type

function checkFileType(file, cb) {
    // allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    //check ext
    const extname = filetypes.test(path.extname(file.originalname).toLocaleLowerCase());
    //check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Image only');
    }
}
//init app
const app = express();

app.get('/', (req, res) => res.render('index'));

app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.render('index', {
                msg: err
            });
        } else {
            if (req.file == undefined) {
                res.render('index', {
                    msg: 'Error: no file selected!'
                });
            } else {
                res.render('index', {
                    msg: 'File Uploaded!',
                    file: 'uploads/' + '${req.file.filename}'
                });
            }
        }

    })
});



app.set('view engine', 'ejs');

app.use(express.static('./public'));



app.listen(3000, () => console.log('server started on port 3000'));