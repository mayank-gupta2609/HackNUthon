const mongoose = require('mongoose');
const { Schema } = mongoose;

const ChatSchema = new Schema({
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }, 
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }, 
    chat: {
        type: [String],
        required: true, 
    }
});

const Chat = mongoose.model('chat', ChatSchema);
module.exports = Chat;
