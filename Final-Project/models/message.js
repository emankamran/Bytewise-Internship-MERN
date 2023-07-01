const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const messageSchema = new mongoose.Schema({
  
    user:{
        type:String,
        required:"User is required!",
        
    },
    message:{
        type:String,
        required:"Message is required!"
    },
    date:{
        type:String,
        required:"Date is required!"
    }
})

module.exports = mongoose.model('Message', messageSchema);
