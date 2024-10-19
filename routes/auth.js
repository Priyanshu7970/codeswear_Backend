const express = require('express');  
const User = require('../models/User')
const router = express.Router() ;  
const { body, validationResult } = require('express-validator');  // npm express validator 
var JWT = require('jsonwebtoken')
const JWT_SECRET = "Harryisgood$boy"
const bcrypt = require('bcryptjs'); // npm bcryptjs (for hashing, salt and Paper) : This are the technique which help to protect the database or user for hacker
var fetchuser = require('../middilware/fetchuser');
// Create a user using: Post "/api/auth/createuser No longin required" 


router.post('/createuser',[body('email').isEmail(), body('password').isLength({ min: 5 })],async(req,res)=>{ 
  let success = false ;
   try { 

     // If there are error  then return bad request and errors
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
       return res.status(400).json({success, errors: errors.array() });
      }  
      // check whether a user of this email already exist 
      let user = await User.findOne({email:req.body.email}) 
      if(user){
        res.status(400).json({success,error:"Sorry user for this email is already exists"})
      }    
      const salt = await bcrypt.genSalt(10)
      const securedPassword = await bcrypt.hash(req.body.password,salt)  ;
      
      user = await User.create({
        password: securedPassword,
        email:req.body.email
      }) 
        const data = {
          user:{
            id: user.id
          }
        } 
        success = true ;
      const authtoken=JWT.sign(data,JWT_SECRET) 
      res.json({success,authtoken}) 

    } catch (error) {
     console.error(error.message) 
     res.status(500).send("Some error occured")

    } 
})    
// Aunthenticate a user using : POST "/api/auth/login" now we are checking whether a user of email or passoword exist or not 
router.post('/login',body('email').isEmail(), body('password').isLength({ min: 5 }),async(req,res)=>{
  // If there are error  then return bad request and errors
  const errors = validationResult(req);
     if (!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array() });
      }  
      //  if the entered field is correct then we will check whether the entered email or password is exist or not   
      const {email,password} = req.body ; 
      let success = false ;
  try {  
       let user = await User.findOne({email}) 
       if(!user){
         return res.status(400).json({success,error:"Please try to login with the correct credential"})
       } 
       const passwordcompare = await bcrypt.compare(password,user.password)
       if(!passwordcompare){
        return res.status(500).json({success,error:"Please try to login with the correct credential"})
       } 
       const data = {
        user:{
          id: user.id
        }
      }
    const authtoken=JWT.sign(data,JWT_SECRET) 
     success = true ;
    res.json({success,authtoken}) 
    } 
    catch (error) {  
      console.error(error.message)
      res.status(500).send("Internal server error");
 
     }  

  });
  // Route 3: Get log in User details using: POST:"/api/auth/getuser". Login required 
  router.post('/getuser',fetchuser,async(req,res)=>{
  try{  
      userId = req.user.id;
       const user =  await User.findById(userId).select("-password") 
        res.send(user)
  }

  catch(error){
    console.error(error.message)
      res.status(500).send("Internal server error");
  }
})

module.exports = router ;