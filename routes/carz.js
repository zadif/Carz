import express from "express";
import Car from "../models/Car.js"; 
import bodyParser from "body-parser"
import wrapAsync from "../utils/wrapAsync.js";
import ExpressError from "../utils/ExpressError.js";


const router=express.Router();


router.get('/',wrapAsync( async (req,res,next)=>{
   
    let cars=await Car.find();
  
    res.render('index.ejs',{cars});

    // res.render('header.ejs')
}));

router.get('/new',(req,res)=>{
    res.render('new.ejs');
});
router.post('/new',wrapAsync(async (req,res,next)=>{
    
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
        year:req.body.year
     });
     req.flash("success","New Car Added");
     req.flash("num",1);
   await newCar.save();
    res.redirect('/carz');
}));

router.get('/delete/:id',wrapAsync(async (req,res,next)=>{
    let {id}=req.params;

    let car=await Car.findByIdAndDelete(id);
    if(!car){
        req.flash("success","Car not exist");
        req.flash("num",3);
        res.redirect('/carz');
    }else{

     req.flash("success","Car Deleted");
    req.flash("num",3);
    res.redirect('/carz');
    }
}));

router.get('/edit/:id',wrapAsync(async (req,res,next)=>{
    
    let {id}=req.params;
    
    let car=await Car.findById(id);
    if(!car){
        req.flash("success","Car not exist");
        req.flash("num",3);
        res.redirect('/carz');
    }else
    res.render('new.ejs',{car});
}));

router.post('/edit/:id',wrapAsync(async (req,res,next)=>{
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
     if(!car){
         req.flash("success","Car not exist");
         req.flash("num",3);
         res.redirect('/carz');
     } else {

    await Car.findByIdAndUpdate(id,newCar,{validations:true});
    req.flash("success","Car Edited");
    req.flash("num",2);
    res.redirect('/carz');
}
}));

router.get("/view/:id",wrapAsync(async(req,res,next)=>{
    let {id}=req.params;
    let car= await Car.findById(id).populate("reviews");
    
    if(!car){
        req.flash("success","Car not exist");
        req.flash("num",3);
        res.redirect('/carz');
    }else
   res.render("view.ejs",{car});

}));

export default router;