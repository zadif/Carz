import mongoose from "mongoose";
import Car from "./models/Car.js";
import validator from 'validator'; 

main().then(()=>console.log('Connection successful'))
.catch(error => console.log(error));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Carz');
}

let cars=[{
    name:"Hawaie",
    description:"A beautiful car",
    image:"https://carwow-uk-wp-3.imgix.net/18015-MC20BluInfinito-scaled-e1707920217641.jpg" ,
    price:2900,
    location:"Tajpura",
    year:2024,
  owner: '66ce1745ad2df608598bc296'
},{
    name:"Toyota",
    description:"A beautiful car",
    image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQL6bmlIucVIfLAFFsZQ6A51YM3JwBOCMoryw&s" ,
    price:2900,
    location:"Tajpura",
    year:2024,
  owner: '66ce1745ad2df608598bc296'
},{
    name:"Cultus",
    description:"A beautiful car",
    image:"https://www.carandbike.com/_next/image?url=https%3A%2F%2Fimages.carandbike.com%2Fcar-images%2Fbig%2Fhyundai%2Fcreta%2Fhyundai-creta.jpg%3Fv%3D92&w=3840&q=75" ,
    price:2900,
    location:"Tajpura",
    year:2024,
  owner: '66ce1745ad2df608598bc296'
},{
    name:"Mercedes",
    description:"A beautiful car",
    image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQL6bmlIucVIfLAFFsZQ6A51YM3JwBOCMoryw&s" ,
    price:2900,
    location:"Tajpura",
    year:2024,
      owner: '66ce1745ad2df608598bc296'
},{
    name:"Bhugatti",
    description:"A beautiful car",
    image:"https://static.toiimg.com/photo/80387978.cms" ,
    price:2900,
    location:"Tajpura",
    year:2024,
      owner: '66ce1745ad2df608598bc296'
},{
    name:"Fortuner",
    description:"A beautiful car",
    image:"https://vid.alarabiya.net/images/2023/04/12/2d220739-e6e3-4f4a-86f0-672691659959/2d220739-e6e3-4f4a-86f0-672691659959_16x9_1200x676.jpg" ,
        price:2900,
    location:"Tajpura",
    year:2024,
      owner: '66ce1745ad2df608598bc296'
}
];

function add(){
   for(let i=0;i<5;i++)
    Car.insertMany(cars);
}add();


