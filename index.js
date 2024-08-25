import express from "express";
import mongoose from "mongoose";
import Car from "./models/Car.js"; 
import bodyParser from "body-parser"
import wrapAsync from "./utils/wrapAsync.js";
import ExpressError from "./utils/ExpressError.js";
import carSchemaJoi from "./models/joinSchema.js";


const app=express();
const port=3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));

main().then(()=>console.log('Connection successful'))
.catch(error => console.log(error));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Carz');
}



app.get('/',wrapAsync( async (req,res,next)=>{
  
    let cars=await Car.find();
    
    res.render('index.ejs',{cars});

//    res.render('footer.ejs')
}));

app.get('/new',(req,res)=>{
    res.render('new.ejs');
});
app.post('/new',wrapAsync(async (req,res,next)=>{
    
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
     
   await newCar.save();
    res.redirect('/');
}));

app.get('/delete/:id',wrapAsync(async (req,res,next)=>{
    let {id}=req.params;

    await Car.findByIdAndDelete(id);
    res.redirect('/');
}));

app.get('/edit/:id',wrapAsync(async (req,res,next)=>{
    
    let {id}=req.params;
    
    let car=await Car.findById(id);
 
    res.render('new.ejs',{car});
}));

app.post('/edit/:id',wrapAsync(async (req,res,next)=>{
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
     
   await Car.findByIdAndUpdate(id,newCar,{validations:true});
   res.redirect('/');
}));

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