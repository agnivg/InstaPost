const express=require('express')
const app=express()
const cors=require('cors')
const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')

const {MONGODB_URI}=require('./config/secrets')
const PORT=process.env.PORT||8000

mongoose.connect(MONGODB_URI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>console.log("Connection successful")).catch((err)=>{
    console.log(err);
})

require('./models/postSchema')
require('./models/userSchema')
require('./models/roomSchema')

app.use(cors());
app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))

if(process.env.NODE_ENV=='production'){
    app.use(express.static('client/build'))
    const path=require('path')
    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

app.listen(PORT,()=>{
    console.log(`Listening to PORT ${PORT}`)
})