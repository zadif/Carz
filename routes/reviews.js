import express from "express";
import Car from "../models/Car.js"; 
import wrapAsync from "../utils/wrapAsync.js";
import ExpressError from "../utils/ExpressError.js";
import {reviewSchemaJoi} from "../models/joinSchema.js";
import Review from "../models/review.js";


const router=express.Router();

const validateReviewJoi= (req,res,next)=>{
  
    let {error}=reviewSchemaJoi.validate(req.body);
    if(error){
        next(new ExpressError(407,error.message));
    }else{
        next();
    }
}

router.post("/:id",validateReviewJoi, wrapAsync(async(req,res,next)=>{
    
    let {id}=req.params;
    let car= await Car.findById(id);
    let review=new Review(
        req.body
    );
    
    car.reviews.push(review);

    await review.save();
    await car.save();
    req.flash("success","Review Added");
     req.flash("num",1);
   res.redirect(`/carz/view/${id}`);

}));

router.post("/:id/:id2",wrapAsync(async(req,res,next)=>{
    let carId=req.params.id;
    let reviewId=req.params.id2;
  
    let car= await Car.findById(carId);
    await Review.findByIdAndDelete(reviewId);
    let reviewIndex=-1,index=0;
    for(let review of car.reviews)
    {
        if(reviewId==review._id){
            
            reviewIndex=index;
            break;
        }
        index++;
    }
    
    car.reviews.splice(reviewIndex,1);
    
    car.save();
    req.flash("success","Review Deleted");
     req.flash("num",3);
    res.redirect(`/carz/view/${carId}`);
    
}));

export default router;