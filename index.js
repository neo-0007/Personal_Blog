const express = require('express');
const fs = require('fs');
const mongoose = require('mongoose');

const PORT = 8000;
const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/personal-blog-hrishi")
  .then(() => console.log("MongoDB Connected!"))
  .catch((err) => console.log("Error Connecting MongoDB ", err));

const blogSchema = mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true,
        maxlength:100
    },
    author:{
        type:String,
        required:true,
        maxlength:30
    },
    content:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        default:''
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    tags: {
        type: [String],
        default: [],
    },
});

const Blog = mongoose.model('Blog',blogSchema);

app.set('view engine','ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.listen(PORT,(err)=>{
    if(err){
        console.log("Error occured : ",err);
    }else{
        console.log("App running on port ",PORT);
    }
});


app.get('/',async(req,res)=>{
    const result = await Blog.find({});
    return res.render('home',{"blogs":result});
});

app.get('/blogs',async(req,res)=>{
    const result = await Blog.find({});
    if(result){
        return res.statusCode(200).json(result);
    }else{
        return res.statusCode(400),json({"msg":"Error"})
    }
});

app.get('/blog/:id',async(req,res)=>{
    const result = await Blog.findById(req.params.id);
    if(result){
        return res.render('blog',{"blog":result});
    }else{
        return res.statusCode(404).json({"msg":"Blog not found!"});
    }
});

app.post('/blog',async (req,res)=>{
    const body = req.body;
    const result = await Blog.create({
        title:body.title,
        author:body.author,
        content:body.content,
        image:body.image,
        createdAt:body.createdAt,
        tags:body.tags
    })
    if(result){
        return res.status(201).json({message:"Success!"});
    }else{
        return res.status(400).json({message:"Error adding!"});
    }
});