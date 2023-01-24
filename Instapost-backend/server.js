const express=require('express')
const app=express()
const cors=require('cors')
const mongoose=require('mongoose')

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

app.use(cors());
app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))

app.listen(PORT,()=>{
    console.log(`Listening to PORT ${PORT}`)
})