import mongoose from "mongoose";
import validator from 'validator'; 
import Review from "./review.js";


const Schema=mongoose.Schema;

const carSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true,
        
        validate: {
            validator: (value) => validator.isURL(value),
            message: 'Must be a Valid URL'
        }
          
    },
    price:{
        type:Number,
        required:true,
        min:0
    },
    country:{
        type:String,
        
        default:"Pakistan"
    },
    location:{
        type:String,
        required:true
    },
    year:{
        type:Number,
        required:true,
        min:[2000,"Your car is older"],
        max:[new Date().getFullYear(),"Futuristic cars not supported"],
    },
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review",
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    }
});

carSchema.post("findOneAndDelete", async (car)=>  {
 
    if (car.reviews.length) {
       
        await Review.deleteMany({ _id: { $in: car.reviews } });
      
    }
});

const Car=mongoose.model("Car",carSchema);

export default Car;