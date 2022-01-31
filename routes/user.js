const e = require('express')
const express=require('express')
const router=express.Router()
const mongoose=require('mongoose')
const verifyLogin=require('../middleware/verifylogin')
const Post=mongoose.model("Post")
const User=mongoose.model("User")
const Room=mongoose.model("Room")

router.get('/user/:id',verifyLogin,(req,res)=>{
    User.findOne({_id:req.params.id}).select('-password').then((user)=>{
        Post.find({postedBy:req.params.id}).populate("postedBy","_id name username").populate('comments.writtenBy','_id username').then(posts=>{
            return res.json({user,posts})
        }).catch(err=>{
            console.log(err)
        })
    }).catch(err=>{
        console.log(err)
    })
})

router.get('/chat/:id',verifyLogin,(req,res)=>{
    const room1=req.user._id+req.params.id
    const room2=req.params.id+req.user._id
    const email=req.user.email
    const e=email.substring(0,email.indexOf('@'))+'%40'+email.substring(email.indexOf('@')+1)
    const d1=`https://instapost-chat-app.herokuapp.com/room?name=${req.user.username}&email=${e}&room=${room1}`
    const d2=`https://instapost-chat-app.herokuapp.com/room?name=${req.user.username}&email=${e}&room=${room2}`
    Room.findOne({room:room1}).then((r)=>{
        if(r){
            return res.json({url:d1})
        }else{
            Room.findOne({room:room2}).then((ro)=>{
                if(ro){
                    return res.json({url:d2})
                }
                else{
                    const rom=new Room({
                        room:room1
                    })
                    rom.save().then(u=>{
                        return res.json({url:d1})
                    }).catch(err=>{
                        console.log(err)
                    })
                }
            }).catch(err=>{
                console.log(err)
            })
        }
    }).catch(err=>{
        console.log(err)
    })
})

router.put('/updatepic',verifyLogin,(req,res)=>{
    User.findByIdAndUpdate({_id:req.user._id},{
        profilepic:req.body.profilepic
    },{new:true}).select('-password').populate("followers","_id username profilepic").populate("following","_id username profilepic").then(user=>{
        if(user)
            return res.json({success:true,message:'Profile pic updated',user:user})
        else
            return res.json({success:false,message:'Error in updating pic'})
    }).catch(err=>{
        console.log(err)
    })
})

router.put('/follow',verifyLogin,(req,res)=>{
    User.findByIdAndUpdate({_id:req.user._id},{
        $push:{following:req.body.followId}
    },{new:true}).select('-password').populate("followers","_id username profilepic").populate("following","_id username profilepic").then(user=>{
        User.findByIdAndUpdate({_id:req.body.followId},{
            $push:{followers:req.user._id}
        },{new:true}).select('-password').then(u=>{
            return res.json({user:user,fuser:u})
        }).catch(e=>{
        console.log(e)
        })
    }).catch(err=>{
        console.log(err)
    })
})

router.put('/unfollow',verifyLogin,(req,res)=>{
    User.findByIdAndUpdate({_id:req.user._id},{
        $pull:{following:req.body.unfollowId}
    },{new:true}).select('-password').populate("followers","_id username profilepic").populate("following","_id username profilepic").then(user=>{
        User.findByIdAndUpdate({_id:req.body.unfollowId},{
            $pull:{followers:req.user._id}
        },{new:true}).select('-password').then(u=>{
            return res.json({user:user,fuser:u})
        }).catch(e=>{
        console.log(e)
        })
    }).catch(err=>{
        console.log(err)
    })
})

module.exports=router