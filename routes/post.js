const e = require('express')
const express=require('express')
const router=express.Router()
const mongoose=require('mongoose')
const verifyLogin=require('../middleware/verifylogin')
const Post=mongoose.model("Post")

router.get('/allposts',verifyLogin,(req,res)=>{
    Post.find().populate("postedBy","_id name username").populate("comments.writtenBy","_id username").then(posts=>{
        return res.json({posts:posts})
    }).catch(err=>{
        console.log(err)
    })
})

router.get('/myposts',verifyLogin,(req,res)=>{
    Post.find({postedBy:req.user._id}).populate("postedBy","_id name username").populate('comments.writtenBy','_id username').then(posts=>{
        return res.json({posts:posts})
    }).catch(err=>{
        console.log(err)
    })
})

router.get('/myfollowingsposts',verifyLogin,(req,res)=>{
    Post.find({postedBy:{$in:req.user.following}}).populate("postedBy","_id name username").populate('comments.writtenBy','_id username').then(posts=>{
        return res.json({posts:posts})
    }).catch(err=>{
        console.log(err)
    })
})

router.post('/createpost',verifyLogin,(req,res)=>{
    const {title,body,image}=req.body
    req.user.password=undefined     //so that mongodb does not store the user's password
    const post=new Post({
        title:title,
        body:body,
        image:image,
        postedBy:req.user
    })
    post.save().then(u=>{
        return res.json({success:true,message:"Posted Successfully"})
    }).catch(err=>{
        console.log(err)
    })
})

router.put('/like',verifyLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },{new:true}).populate("postedBy","_id name username").populate('comments.writtenBy','_id username').exec((err,result)=>{
        return res.json({result})
    })
})

router.put('/dislike',verifyLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{new:true}).populate("postedBy","_id name username").populate('comments.writtenBy','_id username').exec((err,result)=>{
        return res.json({result})
    })
})

router.put('/addcomment',verifyLogin,(req,res)=>{
    const comments={
        text:req.body.comment,
        writtenBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comments}
    },{new:true}).populate("postedBy","_id name username").populate('comments.writtenBy','_id username').exec((err,result)=>{
        return res.json({result})
    })
})

router.delete('/deletepost/:postId',verifyLogin,(req,res)=>{
    Post.findByIdAndDelete({_id:req.params.postId}).exec((err,result)=>{
        if(result)
            return res.json({success:true,message:'Post Deleted Successfully',result:result})
        else
            return res.json({success:false,message:'Unsuccessful'})
    })
})

module.exports=router