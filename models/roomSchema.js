const mongoose=require('mongoose')
const roomSchema=new mongoose.Schema({
    room:String
});
mongoose.model("Room",roomSchema);