import mongoose,{Schema} from "mongoose";

const mess = new Schema({
    messName:{
        type:String,
        required:true
    },
    capacity:{
        type:Number,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
        required:true
    },
});

export default mongoose.model("Mess",mess);