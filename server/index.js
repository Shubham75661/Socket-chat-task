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
      socket.join(data);
      // Msg.find({user : data.username, room : data.room}).then(data =>{
      //   data.map((data) => 
      //   {socket.broadcast.emit("receive_message", data);
      //   })
      //    })
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
      const Message = new Msg({msg : data.message, user : data.author, room : data.room});
      Message.save().then(() => {
        socket.broadcast.emit("receive_message", data);
      })
    });
  
    socket.on("disconnect", () => {
      console.log("User Disconnected", socket.id);
    });

  });
  
  server.listen(3001, () => {
    console.log("SERVER RUNNING");
  });
  