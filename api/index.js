const mongoose = require('mongoose');
const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const cors = require("cors")
const path = require("path")
const Dir = path.join(__dirname, "../client")
const port = process.env.PORT || 8000
const multer = require("multer")
let Filename = ""
require('dotenv').config();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./Images");
    },
    filename: (req, file, cb) => {
      Filename = Date.now() + path.extname(file.originalname)
      console.log(Filename);
      cb(null, Filename);
    }
  });
  

app.use(express.json());
const upload = multer({storage})
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())
// parse application/json
app.use(bodyParser.json())
const database = (module.exports = () => {
    
  try {
    mongoose.connect(
      `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.vbcrt.mongodb.net/?retryWrites=true&w=majority`
    );
    console.log("Database connected succesfully");
  } catch (error) {
    console.log(error);
    console.log("Database connection failed");
  }
});

database();

const Contactschema = mongoose.Schema({
  Fname : String,
  Lname : String,
  email : String,
  number : String,
  msg : String
})
const Orderschema = mongoose.Schema({
  Fname : String,
  Lname : String,
  email : String,
  number : String,
  msg : String,
  type : String,
  img: String
})
const Contact = mongoose.model("SpeksContact", Contactschema)
const Order = mongoose.model("SpeksOrder", Orderschema)

app.use(express.static(Dir))
app.use(express.static("Images"))
app.get("/", ()=>{
    res.send("hello")
  })



app.post("/upload", upload.single("image"),async (req,res)=>{
  const {Fname, Lname, email, number, msg, type} = req.body

  const create = await Order.create({
    Fname,
    Lname,
    email,
    number,
    msg,
    type,
    img : Filename


 })
  const save =  await create.save()
  console.log(save)
  res.send("message Received")

  })
app.post("/contact", async (req,res)=>{
const {Fname, Lname, email, number, msg} = req.body

  const create = await Contact.create({
    Fname,
    Lname,
    email,
    number,
    msg


 })
  const save =  await create.save()
    console.log(save)
    res.send("message Received")
  })


  app.get("/upload", async (req,res)=>{
    const Objs = await Order.find()
    res.send(Objs)
    console.log(Objs)
  })
  app.get("/contact", async (req,res)=>{
    const Objs = await Contact.find()
    res.send(Objs)
    console.log(Objs)
  })
  app.listen(port, ()=>{
      console.log("started")
  })