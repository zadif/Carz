import Car from "./models/Car.js";
import { reviewSchemaJoi } from "./models/joinSchema.js";
import Review from "./models/review.js";
import ExpressError from "./utils/ExpressError.js";

export function isLoggedIn(req,res,next){
    if(!req.isAuthenticated())
        {   
           req.session.redirectUrl=req.originalUrl;
          
            req.flash("error","User not Logged In");
            return res.redirect("/user/login");
        }
        next();
}

export function redirectUrl(req,res,next){
  
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

export async function isOwner (req,res,next){
    
    let {id}=req.params;
    let car=await Car.findById(id);

    if(!req.user._id .equals( car.owner)){
      
        req.flash("error","You don't have access to manipulate anyone else's car");
        req.flash("num",3);
       return res.redirect('/carz');
    }
    next();
}

export const validateReviewJoi= (req,res,next)=>{
  
    let {error}=reviewSchemaJoi.validate(req.body);
    if(error){
        next(new ExpressError(407,error.message));
    }else{
        next();
    }
}

export async function isAuthor (req,res,next){
    
    let {id2}=req.params;
    let {id}=req.params;
   
    let review=await Review.findById(id2);
    
    if(!req.user._id .equals(review.author)){
      
        req.flash("error","You don't have access to manipulate anyone else's review");
        req.flash("num",3);
       return res.redirect(`/carz/view/${id}`);
    }
    next();
}
