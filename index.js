const express = require('express');
const mongoose = require('mongoose');
const connectDb = require("./utils/db");
const {marked} = require('marked');

const PORT = 8000;
const app = express();

connectDb.connectDb();

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

const likesSchema= mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    link:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});


const Blog = mongoose.model('Blog',blogSchema);
const Likes= mongoose.model('Likes',likesSchema);

app.set('view engine','ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.listen(PORT,'0.0.0.0',(err)=>{
    if(err){
        console.log("Error occured : ",err);
    }else{
        console.log("App running on port ",PORT);
    }
});


app.get('/',async(req,res)=>{
    const blogResults = await Blog.find({}).sort({createdAt:-1});
    const likeResults = await Likes.find({});
    return res.render('home',{"blogs":blogResults,"likes":likeResults});
});

app.get('/blogs',async(req,res)=>{
    const result = await Blog.find({}).sort({createdAt:-1});
    res.render('allblogs',{"blogs":result});
});

app.get('/blog/:id',async(req,res)=>{
    const result = await Blog.findById(req.params.id);
    if(result){
        const htmlContent = marked(result.content);
        return res.render('blog',{"blog":result,"content":htmlContent});
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



app.get('/likes',async (req,res)=>{
    const result = await Likes.find({});
    if(result){
        res.render('all-likes',{"likes":result});
    }else{
        res.status(400).json({"msg":"Error fetching blogs!"});
    }
});

app.get('/like/:id', async (req,res)=>{
    const result = await Likes.findById(req.params.id);
    const link = result.link;

    if(link){
    res.redirect(link);
    }else{
        res.status(404).json({"msg":"Link not found!"});
    }
});

app.post('/like',async(req,res)=>{
    const body = req.body;
    const result = await Likes.create({
        title: body.title,
        link:body.link,
        createdAt: body.createdAt
    });

    if(result){
        res.status(201).json({"msg":"Success!"});
    }else{
        res.status(400).json({"msg":"Error while adding!"});
    }
});