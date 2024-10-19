
const mongoose  = require('mongoose'); 

const NotesSchema = mongoose.Schema({  
    // the user here work as forein key where user can only check there notes
    user:{
      type:mongoose.Schema.Types.ObjectId , 
      ref:'user'
    },
    title: {
     type:String,
     required:true
    },
    description:{
        type:String, 
        required:true
    },  
    tag:{
          type:String,
          default:"personal"
    },
    date:{
        type:Date,
        default:Date.now
    }
}) 
module.exports = mongoose.model('notes',NotesSchema)
