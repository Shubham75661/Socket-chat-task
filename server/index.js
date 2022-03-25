const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const {Server} = require('socket.io');
const mongoose = require('mongoose');
const Msg = require('./models/messages');
const dotenv = require('dotenv')

dotenv.config()

//Connection to Mongodb
const mongoDB = process.env.Mongo_connection

mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology : true}).then(() => {
    console.log('connected')
}).catch(err => console.log(err));


app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors:{
        origin : "http://localhost:3000",
        methods : ["GET", "POST"]
    }
});


io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);
    socket.on("join_room", (data) => {
      socket.join(data.room);
       Msg.find({ room : data.room}).then(result =>{
        result.map((data) => 
        {
          socket.emit("receive_message", data);
        })
         })
      console.log(`User with ID: ${socket.id} joined room: ${data.room}`);
      // Msg.find({user : data.username, room : data.room}).limit(100).fetch(function(err, res){
      //   if(err){
      //     throw err;
      //   }
      //   socket.broadcast.emit("receive_message", data);
      // })
    });

    //Sending data
    socket.on("send_message", (data) => {
      const Message = new Msg({message : data.message, author : data.author, room : data.room});
      Message.save().then(() => {
        socket.broadcast.emit("receive_message", data);
      })
    });
    socket.on("send_file", (data) => {
      const Message = new Msg({author : data.author, room : data.room, media : data.media, filename : data.filename});
      Message.save().then(() =>{
        socket.broadcast.emit("receive_message", data);
      setTimeout(() => {
       Msg.deleteOne({filename : data.filename}).then((result) =>{
          console.log(result)
       }).catch((error) => {
          console.log(error)
       })  
      }, 8000);
      })  
    });

    // socket.on('send_file', (file) =>{
    //   console.log(file)
    //   // socket.broadcast.emit("receive_file", file);
    // })
  
    socket.on("disconnect", () => {
      console.log("User Disconnected", socket.id);
    });

  });
  
  server.listen(3001, () => {
    console.log("SERVER RUNNING");
  });
  