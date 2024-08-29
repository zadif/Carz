import express from "express";
import Car from "../models/Car.js"; 
import wrapAsync from "../utils/wrapAsync.js";
import Review from "../models/review.js";
import { validateReviewJoi,isLoggedIn,isAuthor } from "../middlewares.js";

const router=express.Router();


router.post("/:id",isLoggedIn,validateReviewJoi, wrapAsync(async(req,res,next)=>{
    
    let {id}=req.params;
    let car= await Car.findById(id);
    let review=new Review(
        req.body
    );
  
    review.author=req.user._id;
    
    car.reviews.push(review);

    await review.save();
    await car.save();
    req.flash("success","Review Added");
     req.flash("num",1);
   res.redirect(`/carz/view/${id}`);

        }
    )
);

router.get("/:id/:id2",isLoggedIn,isAuthor,wrapAsync(async(req,res,next)=>{
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