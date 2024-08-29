import express from "express";
import mongoose from "mongoose";
import Car from "./models/Car.js"; 
import bodyParser from "body-parser"
import ExpressError from "./utils/ExpressError.js";
import Review from "./models/review.js";
import carzRouter from "./routes/carz.js";
import reviewRouter from "./routes/reviews.js";
import userRouter from "./routes/user.js";
import session from "express-session";
import flash from "connect-flash";
import passport from "passport";
import localStrategy from "passport-local";
import User from "./models/user.js";
import wrapAsync from "./utils/wrapAsync.js";

const app=express();
const port=3000;
main().then(()=>console.log('Connection successful'))
.catch(error => console.log(error));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Carz');
}
const sessionOptions={
  secret:"Hola",
  resave:false,
  saveUninitialized:true,
  cookie:{
    httpOnly:true,
    expires: Date.now() + 7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    }
}
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{ //we save the flash message in locals object, after each request is sent 
  
  const msg=req.flash("success") + req.flash("error")
  res.locals.message=msg;
  res.locals.num=req.flash("num"); //method to give different colours to different messages 1 for add 2 edit, 3 delete
  res.locals.currUser=req.user;
  
  next();
});


app.use("/carz",carzRouter);
app.use("/review",reviewRouter);
app.use("/user",userRouter);

app.get("/",(req,res)=>{
  res.render("header.ejs");
})

//if client tries to go to a certain page which doesnot exist, we first check all above route and then this statment is triggered , it is like a default statment
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
})


//middleware to get name of error
app.use((err,req,res,next)=>{
    console.log(err.name);
  if(err.name==="ValidationError")
    err.status=400;

    next(err);
});

app.use((err,req,res,next)=>{
    
    let{status=500,message="Something went wrong"}=err;
    res.status(status).render("error.ejs",{message})
//   res.status(status).send(message);
})

app.listen(port,()=>{
    console.log('Listening on port ',port);
});