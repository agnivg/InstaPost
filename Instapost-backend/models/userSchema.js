const mongoose=require('mongoose')
const {ObjectId}=mongoose.Schema.Types
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    profilepic:{
        type:String,
        default:'data:image/jpeg;base64,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'
    },
    followers:[{
        type:ObjectId,
        ref:'User'
    }],
    following:[{
        type:ObjectId,
        ref:'User'
    }]
});
mongoose.model("User",userSchema);