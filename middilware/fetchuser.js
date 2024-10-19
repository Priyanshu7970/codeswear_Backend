const JWT = require('jsonwebtoken')
const JWT_SECRET = "Harryisgood$boy";
const fetchuser = (req,res,next)=>{ 
    //  Get the user from the jwt token and add id to the request object  
     const token = req.header('auth-token')  
     if(!token){
         res.status(401).json({error:"Please authenticate using valid token"})
     } 
     try{
     const data = JWT.verify(token,JWT_SECRET);   
     req.user = data.user
     } 
     catch(error){
        res.status(401).json({error:"Please authenticate using valid token"})
     }



    
    next();

}
module.exports = fetchuser ;