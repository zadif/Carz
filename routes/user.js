import express from "express";
import User from "../models/user.js"; 
import bodyParser from "body-parser"
import wrapAsync from "../utils/wrapAsync.js";
import ExpressError from "../utils/ExpressError.js";
import passport from "passport";
import { redirectUrl,isLoggedIn } from "../middlewares.js";

const router=express.Router();


router.get('/signup',wrapAsync( async (req,res,next)=>{
  res.render("./user/signup.ejs");
}));

router.post('/signup',wrapAsync( async (req,res,next)=>{
  try{
    let {username,email,password}=req.body;
    let user= new User({email,username});
    await User.register(user,password);

    req.flash("success","Welcome to Carz....");
    req.flash("num",1);
    req.login(user,(err)=>{ //we automatically made the user login when he sign's up
      if(err) {
        return next(err);
      }
      res.redirect("/carz");
    })
    
  }catch(err){
    req.flash("success",err.message);
    req.flash("num",3);
    res.redirect("/user/signup");
  }
  
  }));

  router.get('/login',(req,res,next)=>{
    
    res.render("./user/login.ejs");
  });
  
  router.post('/login',redirectUrl, passport.authenticate('local', { failureRedirect: '/user/login',failureFlash:true }),wrapAsync( async (req,res,next)=>{
   
    try{
      req.flash("success","Welcome to Carz....");
      req.flash("num",1);
     
      res.redirect(res.locals.redirectUrl || "/carz");
    }catch(err){
      req.flash("success",err.message);
      req.flash("num",3);
      res.redirect("/user/signup");
    }
    
    }));


  router.get("/logout",(req,res,next)=>{
      req.logOut((err)=>{
        if(err){
          return next(err);
        }
       req.flash("success","You are logged out");
       req.flash("num",1);
       res.redirect("/carz"); 
      });

    })


export default router;