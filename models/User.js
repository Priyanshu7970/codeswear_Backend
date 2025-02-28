
const mongoose  = require('mongoose'); 
const UserSchema = mongoose.Schema({
    email:{
        type:String, 
        required:true, 
        unique:true
    }, 
    password:{
        type:String,
        required:true,
    }, 
    date:{
        type:Date, 
        default:Date.now,
    }
})  
const User = mongoose.model('user',UserSchema); 
User.createIndexes();
module.exports = User ;
