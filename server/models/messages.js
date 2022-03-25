const mongoose = require('mongoose');
const msgSchema = new mongoose.Schema({
    message:{
        type: String,
    },
    author:{
        type: String,
        required : true
    },
    room:{
        type: String,
        required : true
    }, 
    media:{
        type: String
    },
    filename:{
        type:String
    }
})

const Msg = mongoose.model('message', msgSchema);
module.exports = Msg;