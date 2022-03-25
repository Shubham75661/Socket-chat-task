const express = require('express');
const multer = require('multer');

const app = express();

const storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null,'./Images');
    },

    filename :(req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({storage : storage});

app.post('/send',upload.single('profile'),(req,res,err) =>{
    console.log(req.file)
    res.send("Image uploaded");
})

app.listen('3002', ()=>{
    console.log("Tweaky_filesharing Working on port 3002")
})