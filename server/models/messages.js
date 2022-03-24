const mongoose = require('mongoose');
const msgSchema = new mongoose.Schema({
    msg:{
        type: String,
        required: true
    },
    user:{
        type: String,
        required : true
    },
    room:{
        type: String,
        required : true
    }
})

const Msg = mongoose.model('message', msgSchema);
module.exports = Msg;