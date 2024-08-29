import express from "express";
import Car from "../models/Car.js"; 
import bodyParser from "body-parser"
import wrapAsync from "../utils/wrapAsync.js";
import ExpressError from "../utils/ExpressError.js";
import { isLoggedIn,isOwner } from "../middlewares.js";


const router=express.Router();


router.get('/',wrapAsync( async (req,res,next)=>{
   
    let cars=await Car.find();
  
    res.render('index.ejs',{cars});

    // res.render('header.ejs')
}));

router.get('/new',isLoggedIn,(req,res)=>{
   
    res.render('new.ejs');
});
router.post('/new',isLoggedIn,wrapAsync(async (req,res,next)=>{
    
    //if via postman not a single thing is sent
    if (!req.body || Object.keys(req.body).length === 0) {
        return next(new ExpressError(400, "No data provided. Please send valid data for storing."));
    }
//    let result= carSchemaJoi.validate(req.body);
//    console.log(result);
//     if(result.error){
//         next(new ExpressError(408,result.error));
//     }
    let newCar=new Car({
        name:req.body.name,
        description:req.body.description,
        image:req.body.image,
        price:req.body.price,
        country:req.body.country,
        location:req.body.location,
        year:req.body.year,
        owner:req.user._id,
     });
     req.flash("success","New Car Added");
     req.flash("num",1);
   await newCar.save();
    res.redirect('/carz');
}));

router.get('/delete/:id',isLoggedIn,isOwner,wrapAsync(async (req,res,next)=>{
    let {id}=req.params;

    let car=await Car.findById(id);
    
    if(!car){
        req.flash("error","Car not exist");
        req.flash("num",3);
        return res.redirect('/carz');
    }

    await Car.findByIdAndDelete(id);
    req.flash("success","Car Deleted");
    req.flash("num",3);
    res.redirect('/carz');
       
    
    
}));

router.get('/edit/:id',isLoggedIn,isOwner,wrapAsync(async (req,res,next)=>{
    
    let {id}=req.params;
    
    let car=await Car.findById(id);
    if(!car){
        req.flash("success","Car not exist");
        req.flash("num",3);
        res.redirect('/carz');
    }else
    res.render('new.ejs',{car});
}));

router.post('/edit/:id',isLoggedIn,isOwner,wrapAsync(async (req,res,next)=>{
     //if via postman not a single thing is sent
    
     if (!req.body || Object.keys(req.body).length === 0) {
        return next(new ExpressError(400, "No data provided. Please send valid data for storing."));
    }

    let {id}=req.params;
    let newCar={
        name:req.body.name,
        description:req.body.description,
        image:req.body.image,
        price:req.body.price,
        country:req.body.country,
        location:req.body.location,
        year:req.body.year
     };
     let car=await Car.findById(id);
     
     if(!car){//if we try to send request to a car which is deleted
         req.flash("success","Car not exist");
         req.flash("num",3);
         res.redirect('/carz');
     }
        await Car.findByIdAndUpdate(id,newCar,{validations:true});
        req.flash("success","Car Edited");
        req.flash("num",2);
        res.redirect('/carz');
       
    
}));

router.get("/view/:id",wrapAsync(async(req,res,next)=>{
    let {id}=req.params;
    let car= await Car.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
    
    if(!car){
        req.flash("success","Car not exist");
        req.flash("num",3);
        res.redirect('/carz');
    }else
    req.session.redirectUrl=req.originalUrl; //manually providing the originalurl, if a user is not logged in, and, if he decides to login the url of this current page which will be sended , we have to separately send it manually because we are not sedding this request to isLoggedin because a user can view a car , even if he is not logged in
   res.render("view.ejs",{car});

}));

export default router;