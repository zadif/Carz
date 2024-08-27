import express from "express";
import mongoose from "mongoose";
import Car from "./models/Car.js"; 
import bodyParser from "body-parser"
import ExpressError from "./utils/ExpressError.js";
import Review from "./models/review.js";
import carz from "./routes/carz.js";
import review from "./routes/reviews.js";
import session from "express-session";
import flash from "connect-flash";


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

app.use((req,res,next)=>{ //we save the flash message in locals object, after each request is sent 
 
  res.locals.message=req.flash("success");
  res.locals.num=req.flash("num"); //method to give different colours to different messages 1 for add 2 edit, 3 delete
  next();
})


app.use("/carz",carz);
app.use("/review",review);

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