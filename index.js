import express from "express";
import mongoose from "mongoose";
import Car from "./models/Car.js"; 
import bodyParser from "body-parser"

const app=express();
const port=3000;

app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));

main().then(()=>console.log('Connection successful'))
.catch(error => console.log(error));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Carz');
}

app.listen(port,()=>{
    console.log('Listening on port ',port);
});

app.get('/',async (req,res)=>{
    let cars=await Car.find();
    
    res.render('index.ejs',{cars});

//    res.render('footer.ejs')
});

app.get('/new',(req,res)=>{
    res.render('new.ejs');
});
app.post('/new',(req,res)=>{
    let newCar=new Car({
        name:req.body.name,
        description:req.body.description,
        image:req.body.image,
        price:req.body.price,
        country:req.body.country,
        location:req.body.location,
        year:req.body.year
     });
     
    newCar.save();
    res.redirect('/');
});

app.get('/delete/:id',async (req,res)=>{
    let {id}=req.params;

    await Car.findByIdAndDelete(id);
    res.redirect('/');
});

app.get('/edit/:id',async (req,res)=>{
    let {id}=req.params;
    
    let car=await Car.findById(id);
    res.render('new.ejs',{car});
});

app.post('/edit/:id',async (req,res)=>{
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
})