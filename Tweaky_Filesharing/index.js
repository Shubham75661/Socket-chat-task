const express = require('express');
const multer = require('multer');
const {createToken} = require('./Jwt')
const bodyParser = require("body-parser");
const Msg = require('./models/messages')
const mongoose = require('mongoose')

const mongoDB = 'mongodb+srv://shubham334:shubhamak@cluster0.mrxgl.mongodb.net/message-database?retryWrites=true&w=majority'

mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology : true}).then(() => {
    console.log('connected')
}).catch(err => console.log(err));

const app = express();
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json())

// const storage = multer.diskStorage({
//     destination : (req, file, cb) => {
//         cb(null,'./Images');
//     },

//     filename :(req, file, cb) => {
//         cb(null, file.originalname);
//     },
// });

// const upload = multer({storage : storage});

// app.post('/send',upload.single('profile'),(req,res,err) =>{
//     console.log(req.file)
//     const jwtToken = createToken(req.file);
//     res.cookie("jwttoken", jwtToken, {
//         maxAge : 120000
//     });
//     res.send("file uploaded");

// })

app.post('/', async (req, res) => {
    const message = new Msg({
        author : req.body.author,
        room : req.body.room,
        media : req.body.media, 
        filename : req.body.filename
    });
    console.log(message)
    try{ 
        const new_message = await message.save().then(() => {
            setTimeout(() => {
                Msg.deleteOne({filename : message.filename}).then((result) =>{
                   console.log(result)
                }).catch((error) => {
                   console.log(error)
                })  
               }, 8000);
        })
        res.status(200).json(new_message) 
    }catch (err){
        res.status(400).json({message: err.message}) 
    }
})

app.listen('3002', ()=>{
    console.log("Tweaky_filesharing Working on port 3002")
})