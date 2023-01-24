const jwt=require('jsonwebtoken')
const {JWT_SECRET}=require('../config/secrets')
const mongoose=require('mongoose')
const User=mongoose.model('User')

module.exports=(req,res,next)=>{
    const {auth}=req.headers
    if(!auth)
        return res.json({success:false,message:"User not signed in"})
    const token=auth.replace("Bearer ","")
    jwt.verify(token,JWT_SECRET,(err,payload)=>{
        if(err)
            return res.json({success:false,message:"User not signed in"})
        const {_id}=payload
        User.findById(_id).then(userdata=>{
            req.user=userdata
            next()
        })
    })
}